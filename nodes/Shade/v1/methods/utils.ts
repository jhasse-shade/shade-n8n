
//Helper function to prepend drive id to paths, because for routes we require drive id to be in front, but user might not always do that
export const checkDrivePrefix = (fullPath: string, driveId: string) => {
	const expectedPrefix = `/${driveId}`;
	if (!fullPath.startsWith(expectedPrefix)) {
		const cleanPath = fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
		return `/${driveId}${cleanPath}`;
	}
	return fullPath;
}