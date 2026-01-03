import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { ShadeV1 } from './v1/ShadeV1.node';

export class Shade extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Shade',
			name: 'shade',
			icon: 'file:shade.svg',
			group: ['input'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Interact with your Shade workspace',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new ShadeV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}