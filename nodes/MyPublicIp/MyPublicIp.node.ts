import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { IHttpRequestOptions } from 'n8n-workflow/dist/Interfaces';

export class MyPublicIp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'My Public Ip',
		name: 'myPublicIp',
		icon: 'file:MyPublicIpLogo.svg',
		group: ['output'],
		version: 1,
		triggerPanel: false,
		description: 'Get my public IP address',
		subtitle: '={{$parameter["version"]}}',
		defaults: {
			name: 'My Public Ip',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Use ipify.org to find your public IP address',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Version',
				name: 'version',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Ip V4',
						value: 'ip_v4',
						action: 'Get my public ipv4',
					},
					{
						name: 'Ip V6',
						value: 'ip_v6',
						action: 'Get my public ipv6',
					},
					{
						name: 'Both V4/V6',
						value: 'both',
						action: 'Get my public ipv4/ipv6',
					},
				],
				default: 'ip_v4',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				options: [
					{
						displayName: 'Put Result in Field',
						name: 'result_field',
						type: 'string',
						default: 'public_ip',
						description: 'The name of the output field to put the data in',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const version = this.getNodeParameter('version', 0);
		const options = this.getNodeParameter('options', 0);
		const result_field = options.result_field ? (options.result_field as string) : 'public_ip';

		let httpOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		};

		let response: { ip: string | number | boolean | object | null | undefined };
		if (version == 'both' || version == 'ip_v6') {
			httpOptions.url = 'https://api6.ipify.org?format=json';

			response = await this.helpers.httpRequest(httpOptions);
			if (response.ip) {
				items.forEach(
					(item) => (item.json[result_field + (version == 'both' ? '_v6' : '')] = response.ip),
				);
			}
			console.log(response);
		}

		if (version == 'both' || version == 'ip_v4') {
			httpOptions.url = 'https://api.ipify.org?format=json';

			response = await this.helpers.httpRequest(httpOptions);
			if (response.ip) {
				items.forEach(
					(item) => (item.json[result_field + (version == 'both' ? '_v4' : '')] = response.ip),
				);
			}
			console.log(response);
		}

		return [items];
	}
}
