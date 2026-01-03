import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	INodeExecutionData,
	IExecuteFunctions,
	INodeTypeBaseDescription,
} from 'n8n-workflow';


import * as folder from './actions/Folder';
import * as asset from './actions/Asset';

import { workspaceSearch, driveSearch, metadataSearch, metadataOptionSearch } from './methods/SearchFunctions';


const versionDescription: INodeTypeDescription = {
	displayName: 'Shade',
	name: 'shade',
	group: ['transform'],
	version: 1,
	subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
	description: 'Interact with Shade API',
	defaults: {
		name: 'Shade',
	},
	usableAsTool: true,
	inputs: [NodeConnectionTypes.Main],
	outputs: [NodeConnectionTypes.Main],
	credentials: [{ name: 'shadeApi', required: true }],
	requestDefaults: {
		baseURL: 'https://api.shade.inc',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	},
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			options: [
				{
					name: 'Folder',
					value: 'folder',
				},
				{
					name: 'Asset',
					value: 'asset',
				},
				{
					name: 'Share',
					value: 'share',
				},
			],
			default: 'folder',
			noDataExpression: true,
			required: true,
		},
		// Import resource descriptions
		...folder.description,
		...asset.description,
	],
};


// eslint-disable-next-line @n8n/community-nodes/icon-validation
export class ShadeV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		}
	}

	methods = {
		listSearch: {
			workspaceSearch,
			driveSearch,
			metadataSearch,
		},
		loadOptions: {
			metadataOptionSearch,
		}
	}


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'folder') {
					responseData = await folder.execute.call(this, i, operation);
				} else if (resource === 'asset') {
					responseData = await asset.execute.call(this, i, operation);
				}

				if (responseData) {
					this.logger.info(JSON.stringify(responseData));
				}

				returnData.push({
					json: responseData? responseData : {},
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	};
}
