import { INodeProperties, IExecuteFunctions, IDataObject,  } from 'n8n-workflow';
import { apiRequest } from '../../transport';

// Resource description - defines the UI for Asset operations
export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['asset'],
			},
		},
		options: [
			{
				name: 'Comment',
				value: 'comment',
				description: 'Add a comment to an asset',
				action: 'Comment on an asset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an asset by ID',
				action: 'Get an asset',
			},
			{
				name: 'Get Comments',
				value: 'get_comments',
				description: 'Get comments associated with an asset',
				action: 'Get asset comments',
			},
			{
				name: 'Get Shares',
				value: 'get_shares',
				description: 'Get the share links associated with an asset',
				action: 'Get asset shares',
			},
			{
				name: 'Get Transcription',
				value: 'get_transcription',
				description: 'Get transcription for an asset',
				action: 'Get asset transcription',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for an asset by visual description',
				action: 'Search for an asset',
			},
			{
				name: 'Share',
				value: 'share',
				description: 'Generate a share link for an Asset',
				action: 'Share an asset',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an asset',
				action: 'Update an asset',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload a new asset',
				action: 'Upload an asset',
			},
		],
		default: 'upload',
		noDataExpression: true,
	},
	// Fields for UPLOAD operation
	{
		displayName: 'Workspace',
		name: 'workspace',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['upload', 'update', 'search', 'share', 'get_shares'],
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
		description: 'The workspace to work in',
	},
	{
		displayName: 'Drive',
		name: 'drive',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['upload', 'update', 'search', 'get', 'share', 'get_shares', 'get_transcription', 'comment', 'get_comments'],
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
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['upload', 'get_shares', 'share'],
			},
		},
		default: '',
		placeholder: '/my-folder',
		description: 'Path to operate in (Drive ID should be prepended)',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['upload'],
			},
		},
		default: '',
		placeholder: 'document.pdf',
		description: 'Name for the uploaded file',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['upload'],
			},
		},
		default: 'data',
		required: true,
		placeholder: 'data',
		description: 'Name of the binary property containing the file data',
	},
	// Fields for UPDATE
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['update', 'get', 'comment', 'get_comments', 'get_transcription'],
			},
		},
		default: '',
		placeholder: 'asset-123',
		description: 'ID of the asset',
	},
	{
		displayName: 'Metadata Attribute',
		name: 'metadataAttribute',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['update'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select an attribute...',
				typeOptions: {
					searchListMethod: 'metadataSearch',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'attribute-123',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '.+',
							errorMessage: 'Attribute ID cannot be empty',
						},
					},
				],
			},
		],
		placeholder: 'attr-123',
		description: 'ID of the metadata attribute you want to update',
	},
	{
		displayName: 'Metadata Attribute Option',
		name: 'metadataAttributeOption',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'metadataOptionSearch',
			loadOptionsDependsOn: ['metadataAttribute'],
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['update'],
			},
		},
		placeholder: 'attr-123',
		description: 'Use this if updating a select-based option. The list will populate with options when an appropriate attribute is selected. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['update'],
			},
		},
		default: '',
		placeholder: 'New value',
		description: 'Value of the new attribute. Use the string format of whatever type the attribute is i.e. for booleans put true or false. Do not populate if updating a select-based option.',
	},

	//Fields for Search
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['search'],
			}
		},
		placeholder: 'Person smiling',
		description: 'Visual description of an asset you are trying to AI search for. The more descriptive, the better.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['search'],
			}
		},
		placeholder: '10',
		description: 'Max number of results to return',
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
				resource: ['asset'],
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
				resource: ['asset'],
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
				resource: ['asset'],
				operation: ['share'],
			}
		},
		placeholder: '/drive-123/path/to/asset',
		description: 'Path to the asset to be shared. Drive ID should be prepended.',
	},

	//Fields for Comment
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['comment'],
			}
		},
		placeholder: 'This asset is really cool!',
	},
	{
		displayName: 'Public',
		name: 'public',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['comment'],
			}
		},
	},

	//Fields for get Transcription
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		default: 'vtt',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['get_transcription'],
			}
		},
		options: [
			{
				name: "VTT",
				value: 'vtt',
			},
			{
				name: "ScriptSync",
				value: 'scriptsync',
			},
			{
				name: "SRT",
				value: 'srt',
			},
			{
				name: "TXT",
				value: 'txt',
			},
		],
	},
];

/**
 * Upload a part of the file to a presigned URL
 */
async function uploadPartToPresignedUrl(
	context: IExecuteFunctions,
	presignedUrl: string,
	fileBuffer: Buffer,
	start: number,
	endExclusive: number,
): Promise<string> {
	const chunk = fileBuffer.slice(start, endExclusive);

	const response = await context.helpers.httpRequest({
		method: 'PUT',
		url: presignedUrl,
		body: chunk,
		headers: {
			'Content-Length': chunk.length.toString(),
		},
		returnFullResponse: true,
	});

	const etag = response.headers['etag'];
	if (!etag) {
		throw new Error('No ETag returned from presigned URL upload');
	}

	return etag;
}

// Execute function - handles all asset operations
export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject> {
	const driveIdResource = this.getNodeParameter('drive', index) as { mode: string; value: string };
	const driveId = driveIdResource.value;


	if (operation === "comment") {

		const assetId = this.getNodeParameter('assetId', index) as string;
		const comment = this.getNodeParameter('comment', index) as string;
		const isPublic = this.getNodeParameter('public', index) as boolean;

		return await apiRequest.call(
			this,
			'POST',
			`assets/${assetId}/comments`,
			{
				is_public: isPublic,
				comment: comment,
				drive_id: driveId,
				url: "",
			}
		)
	}



	if (operation === "get") {

		const assetId = this.getNodeParameter('assetId', index) as string;

		return await apiRequest.call(
			this,
			'GET',
			`assets/${assetId}`,
			{},
			{
				drive_id: driveId,
			}
		)
	}



	if (operation === "get_comments") {
		const assetId = this.getNodeParameter('assetId', index) as string;

		return await apiRequest.call(
			this,
			'GET',
			`assets/${assetId}/comments`,
			{},
			{
				drive_id: driveId,
			}
		)
	}



	if (operation === "get_shares") {
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


	if (operation === "get_transcription") {
		const assetId = this.getNodeParameter('assetId', index) as string;
		const format = this.getNodeParameter('format', index) as string;

		const resp = await apiRequest.call(
			this,
			'GET',
			`assets/${assetId}/transcription/file`,
			{},
			{
				drive_id: driveId,
				type: format
			}
		)

		return {data: resp}
	}


	if (operation === "search") {
		const query = this.getNodeParameter('query', index) as string;
		const limit = this.getNodeParameter('limit', index) as number;

		return await apiRequest.call(
			this,
			'POST',
			'search',
			{
				drive_id: driveId,
				query: query,
				limit: limit
			}
		)
	}


	if (operation === "share") {
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

	if (operation === 'update') {
		const assetId = this.getNodeParameter('assetId', index) as string;
		const metadataAttribute = this.getNodeParameter('metadataAttribute', index) as string;
		let value = this.getNodeParameter('value', index) as string;

		if (value == null) {
			value = this.getNodeParameter('metadataAttributeOption', index) as string;
		}

		return await apiRequest.call(
			this,
			'POST',
			`assets/${assetId}/metadata/${metadataAttribute}/value`,
			{
				metadata_attribute_value: value,
				drive_id: driveId,
			}
		)
	}


	if (operation === 'upload') {
		const uploadPath = this.getNodeParameter('path', index) as string;
		const fileName = this.getNodeParameter('fileName', index) as string;
		const binaryPropertyName = this.getNodeParameter('binaryProperty', index) as string;

		// Get binary data
		const items = this.getInputData();
		const binaryData = items[index].binary;

		if (!binaryData || !binaryData[binaryPropertyName]) {
			throw new Error(`No binary data found in property: ${binaryPropertyName}`);
		}

		const fileBuffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
		const fileSize = fileBuffer.length;

		// 1) Get pre-upload token
		const tokenResp = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'shadeApi',
			{
				method: 'GET',
				url: `https://api.shade.inc/workspaces/drives/${driveId}/shade-fs-token`,
			},
		);
		const fsToken = tokenResp as string;

		// 2) Prepare multipart upload
		const PART_SIZE = 5 * 1024 * 1024; // 5MB

		const parts = uploadPath.replace(/^\/+/, '').split('/');
		const normalizedParts = parts[0] === driveId ? parts.slice(1) : parts;
		const normalizedFolder = normalizedParts.join('/');
		const finalPath = normalizedFolder ? `/${normalizedFolder}/${fileName}` : `/${fileName}`;

		// 3) Initiate multipart upload
		const initiateResp = await this.helpers.httpRequest({
			method: 'POST',
			url: `https://fs.shade.inc/${driveId}/upload/multipart`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${fsToken}`,
			},
			body: {
				path: finalPath,
				partSize: PART_SIZE,
			},
		});

		const finishToken = (initiateResp as IDataObject).token as string;

		// 4) Upload parts
		const totalParts = Math.ceil(fileSize / PART_SIZE);
		const completed: Array<{ PartNumber: number; ETag: string }> = [];

		for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
			const start = (partNumber - 1) * PART_SIZE;
			const endExclusive = Math.min(start + PART_SIZE, fileSize);

			// Get presigned URL for this part
			const partResp = await this.helpers.httpRequest({
				method: 'POST',
				url: `https://fs.shade.inc/${driveId}/upload/multipart/part/${partNumber}`,
				headers: {
					Authorization: `Bearer ${fsToken}`,
				},
				qs: {
					token: finishToken,
				},
			});

			const presignedUrl = (partResp as IDataObject).url as string;

			// Upload the part
			const etag = await uploadPartToPresignedUrl(
				this,
				presignedUrl,
				fileBuffer,
				start,
				endExclusive,
			);

			completed.push({ PartNumber: partNumber, ETag: etag });
		}

		// 5) Complete multipart upload
		await this.helpers.httpRequest({
			method: 'POST',
			url: `https://fs.shade.inc/${driveId}/upload/multipart/complete`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${fsToken}`,
			},
			qs: {
				token: finishToken,
			},
			body: {
				parts: completed,
			},
		});

		return {
			status: 'Success',
			path: finalPath,
			name: fileName,
		};
	}


	throw new Error(`Unknown operation: ${operation}`);
}










