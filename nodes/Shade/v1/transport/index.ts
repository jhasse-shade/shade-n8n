import {
	GenericValue,
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';


export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | GenericValue | GenericValue[] = {},
	query: IDataObject = {},
) {

	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: `https://api.shade.inc/${endpoint}`,
		headers: {
			'content-type': 'application/json; charset=utf-8',
		},
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'shadeApi', options);
}