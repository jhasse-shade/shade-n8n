import { INodeProperties, IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { apiRequest } from '../../transport';

// Resource description - defines the UI for Folder operations
export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['folder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new folder',
				action: 'Create a folder',
			},
			{
				name: 'Get Shares',
				value: 'get_shares',
				description: 'Get the share links associated with a folder',
				action: 'Get folder shares',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List children of a folder',
				action: 'List a folder',
			},
			{
				name: 'Share',
				value: 'share',
				description: 'Generate a share link for a folder',
				action: 'Share a folder',
			},
		],
		default: 'create',
		noDataExpression: true,
	},
	{
		displayName: 'Workspace',
		name: 'workspace',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create', 'share', 'get_shares', 'list'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a workspace...',
				typeOptions: {
					searchListMethod: 'workspaceSearch',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'workspace-123',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '.+',
							errorMessage: 'Workspace ID cannot be empty',
						},
					},
				],
			},
		],
		description: 'The workspace to work with',
	},
	{
		displayName: 'Drive',
		name: 'drive',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create', 'share', 'get_shares', 'list'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a drive...',
				typeOptions: {
					searchListMethod: 'driveSearch',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'drive-123',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '.+',
							errorMessage: 'Drive ID cannot be empty',
						},
					},
				],
			},
		],
		description: 'The drive to work with',
	},
	// Fields for CREATE operation
	{
		displayName: 'Folder Name',
		name: 'folderName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'My Folder',
		description: 'Name of the folder to create',
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create', 'list', 'share', 'get_shares'],
			},
		},
		default: '',
		placeholder: '/drive123/path/to/my/folder',
		description: 'Path to the parent folder on which to perform the operation. Drive ID should be prepended.',
	},

	//Fields for Share
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['share'],
			}
		},
		placeholder: 'Share link',
		description: 'Name for the share link',
	},
	{
		displayName: 'Public Enabled',
		name: 'publicEnabled',
		type: 'boolean',
		required: true,
		default: false,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['share'],
			}
		},
		placeholder: 'Share link',
		description: 'Whether the link should be enabled or disabled?',
	},

	{
		displayName: 'Allowed Actions',
		name: 'allowedActions',
		type: 'multiOptions',
		options: [
			{
				name: "Comment",
				value: 'comment',
			},
			{
				name: "Download",
				value: 'download',
			},
			{
				name: "Edit Metadata",
				value: 'edit_metadata',
			},
			{
				name: "Upload",
				value: 'edit',
			},
			{
				name: "View",
				value: 'read',
			},
			{
				name: "View Metadata",
				value: 'read_asset_details',
			},
		],
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['share'],
			}
		},
		placeholder: '/drive-123/path/to/asset',
		description: 'Path to the asset to be shared. Drive ID should be prepended.',
	},
];

// Execute function - handles all folder operations
export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject> {

	const driveIdResource = this.getNodeParameter('drive', index) as { mode: string; value: string };
	const driveId = driveIdResource.value;

	if (operation === 'create') {
		const folderName = this.getNodeParameter('folderName', index) as string;
		const path = this.getNodeParameter('path', index) as string;

		await apiRequest.call(
			this,
			'POST',
			`files/directory`,
			{
				path: path + '/' + folderName,
				drive_id: driveId
			},
			{},

		)

		return {
			path: path + '/' + folderName,
			status: 201,
		}
	}

	if (operation === 'get_shares') {
		const path = this.getNodeParameter('path', index) as string;

		return await apiRequest.call(
			this,
			'GET',
			`workspaces/drives/${driveId}/public-file-shares`,
			{},
			{
				path: path,
			}
		)
	}

	if (operation === 'list') {
		let path = this.getNodeParameter('path', index) as string;

		const prefix = `/${driveId}/`;

		if (path.startsWith(prefix)) {
			path = path.slice(prefix.length);
		}

		const fsTokenUrl = `https://fs.shade.inc/${driveId}/fs/listdir?path=${path}`;

		const token = await apiRequest.call(
			this,
			'GET',
			`workspaces/drives/${driveId}/shade-fs-token`
		)

		const options: IHttpRequestOptions = {
			method: 'GET',
			body: {},
			qs:
				{},
			url: fsTokenUrl,
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'Authorization': `Bearer ${token}`,
			},
		};
		return await this.helpers.httpRequest.call(this, options);
	}


	if (operation === 'share') {
		const name = this.getNodeParameter('name', index) as string;
		const path = this.getNodeParameter('path', index) as string;
		const allowedActions = this.getNodeParameter('allowedActions', index) as string[];
		const publicEnabled = this.getNodeParameter('publicEnabled', index) as boolean;

		return await apiRequest.call(
			this,
			'POST',
			`workspaces/drives/${driveId}/public-file-shares`,
			{
				path: path,
				allowed_actions: allowedActions,
				is_public_enabled: publicEnabled,
				name: name,
			}
		)
	}


	throw new Error(`Unknown operation: ${operation}`);
}