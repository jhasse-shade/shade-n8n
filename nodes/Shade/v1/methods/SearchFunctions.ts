import { ILoadOptionsFunctions, INodeListSearchResult, INodePropertyOptions } from 'n8n-workflow';

import { apiRequest } from '../transport';


interface ShadeWorkspaceItem {
	id: string;
	name: string;
}

interface ShadeDriveItem {
	id: string;
	name: string;
}

interface ShadeMetadataItem {
	id: string;
	name: string;
	value_type: string;
	options?: ShadeMetadataOptionItem[];
}

interface ShadeMetadataOptionItem {
	id: string;
	name: string;
}

export async function workspaceSearch(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {

	const resp: ShadeWorkspaceItem[] = await apiRequest.call(this, "GET", "workspaces")

	return {
		results: resp.map(workspace => {
			return {
				"name": workspace.name,
				"value": workspace.id
			}
		})
	}
}

export async function driveSearch(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {

	const selectedWorkspace = this.getNodeParameter("workspace", null, {extractValue: true});

	if (selectedWorkspace == null) {
		return {
			results: []
		}
	}

	const resp: ShadeDriveItem[] = await apiRequest.call(this, "GET", `workspaces/${selectedWorkspace}/drives`);

	return {
		results: resp.map(drive => {
			return {
				"name": drive.name,
				"value": drive.id
			}
		})
	}
}

export async function metadataSearch(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {

	const selectedDrive = this.getNodeParameter("drive", null, {extractValue: true}) as string;

	if (selectedDrive == null) {
		return {
			results: []
		}
	}

	const resp: ShadeMetadataItem[] = await apiRequest.call(this, "GET", `workspaces/drives/${selectedDrive}/metadata`);

	return {
		results: resp.map(metadata => {
			return {
				"name": metadata.name,
				"value": metadata.id
			}
		})
	}
}

export async function metadataOptionSearch(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {

	const selectedDrive = this.getNodeParameter("drive", null, {extractValue: true});
	const selectedAttribute = this.getNodeParameter("metadataAttribute", null, {extractValue: true});

	if (selectedDrive == null) {
		return []
	}
	const resp: ShadeMetadataItem[] = await apiRequest.call(this, "GET", `workspaces/drives/${selectedDrive}/metadata`);

	for (const attribute of resp) {
		if (attribute.id == selectedAttribute) {

			if ((attribute.value_type !== "single_select" && attribute.value_type !== "multi_select") || attribute.options == null) {
				return []
			}

			return attribute.options.map(option => {
					return {
						"name": option.name,
						"value": option.id
					}
				})
		}
	}


	return []
}

