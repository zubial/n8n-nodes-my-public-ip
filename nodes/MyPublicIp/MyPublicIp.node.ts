import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { IHttpRequestOptions } from 'n8n-workflow/dist/Interfaces';
import { MyPublicIpResult } from './models/MyPublicIpResult';

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
						name: 'IP V4',
						value: 'public_ipv4',
						action: 'Get my public ipv4',
					},
					{
						name: 'IP V6',
						value: 'public_ipv6',
						action: 'Get my public ipv6',
					},
					{
						name: 'Both IP V4/V6',
						value: 'both_ipv4/6',
						action: 'Get my public ipv4/ipv6',
					},
				],
				default: 'public_ipv4',
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
						default: 'public',
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
		const result_field = options.result_field ? (options.result_field as string) : 'public';

		let httpOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		};

		let result = new MyPublicIpResult();
		let response: { ip: string | number | boolean | object | null | undefined };
		if (version == 'both_ipv4/6' || version == 'public_ipv6') {
			httpOptions.url = 'https://api6.ipify.org?format=json';

			response = await this.helpers.httpRequest(httpOptions);
			if (response.ip) {
				result.interfaces.push({
					family: 'IPv6',
					address: response.ip as string,
				});
			}
		}

		if (version == 'both_ipv4/6' || version == 'public_ipv4') {
			httpOptions.url = 'https://api.ipify.org?format=json';

			response = await this.helpers.httpRequest(httpOptions);
			if (response.ip) {
				result.interfaces.push({
					family: 'IPv4',
					address: response.ip as string,
				});
			}
		}

		items.forEach((item) => (item.json[result_field] = result));

		return [items];
	}
}
