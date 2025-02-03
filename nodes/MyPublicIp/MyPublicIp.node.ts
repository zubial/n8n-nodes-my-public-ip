import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

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
		requestDefaults: {
			baseURL: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
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
						routing: {
							request: {
								method: 'GET',
								url: 'https://api.ipify.org?format=json',
							},
						},
					},
					{
						name: 'Ip V6',
						value: 'ip_v6',
						action: 'Get my public ipv6',
						routing: {
							request: {
								method: 'GET',
								url: 'https://api6.ipify.org?format=json',
							},
						},
					},
				],
				default: 'ip_v4',
			},
		],
	};
}
