# n8n-nodes-shade

This is an n8n community node. It lets you use Shade in your n8n workflows.

Shade is an AI-powered cloud storage NAS designed to provide you and your team with a single source of truth for accessing, reviewing, and sharing your files.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

To date, the Shade n8n Node supports these actions:
### Folders
Create a folder
Get folder shares
List a folder
Share a folder

### Assets
Comment on an asset
Get an asset
Get asset comments
Get asset shares
Get asset transcription
Search for an asset
Share an asset
Update an asset
Upload an asset

## Usage example: Upload a file to Shade

This walkthrough shows how to upload a file from your local machine into a Shade drive.

**Workflow: Local file → Shade**

1. **Read Binary File node**
   - Set **File Path** to the file you want to upload (e.g. `/home/user/reports/q1.pdf`).
   - This node outputs the file as binary data on the `data` property.

2. **Shade node — Asset › Upload**
   - **Workspace**: select your workspace from the list (or paste its ID).
   - **Drive**: select the target drive from the list (or paste its ID).
   - **Path**: the folder path inside the drive to upload into, e.g. `/reports`. Leave blank to upload to the drive root. 
   - **File Name**: the name the file should have in Shade, e.g. `q1.pdf`.
   - **Binary Property**: the name of the binary field carrying the file — `data` if you used a Read Binary File node with default settings.

3. **Run the workflow.** On success the Shade node outputs:
   ```json
   {
     "path": "/drive-abc123/reports/q1.pdf",
     "name": "q1.pdf"
   }
   ```

The same **Workspace** and **Drive** selector pattern is used across all asset and folder operations.

## Credentials

In order to authenticate with Shade, you will need to provide an API Key which can be found in the setting section once logged in. More in depth info here: https://academy.shade.inc/developers/using-the-api/using-the-api

## Compatibility

This node was tested against version 1.122.5. Minimum version of 1.122.1

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Shade API](https://academy.shade.inc/developers/using-the-api/using-the-api)
