import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ShadeApi implements ICredentialType {
	name = 'shadeApi';
	displayName = 'Shade API';
	documentationUrl = 'https://academy.shade.inc/developers/using-the-api/using-the-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: { password: true },
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.shade.inc',
			url: '/workspaces',
		},
	};

	icon: Icon = 'file:shade.svg';
}