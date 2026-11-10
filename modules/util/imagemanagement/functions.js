// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2026 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function ImageManagement_ImageList_Delete_GeneratedImages( image_ids, callback )
{
	return AJAX_Call_Module( callback, 'admin',
						   	 'imagemanagement',
						   	 'ImageManagement_ImageList_Delete_GeneratedImages',
						   	 'Image_IDs=' + EncodeArray( image_ids ) );
}

function ImageManagement_CheckForUpdatedMasterImages( last_masterimage_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'imagemanagement', 'ImageManagement_CheckForUpdatedMasterImages',
	{
		Last_MasterImage_ID: last_masterimage_id
	}, delegator );
} 

function ImageManagement_CheckForUpdatedGeneratedImages( last_generatedimage_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'imagemanagement', 'ImageManagement_CheckForUpdatedGeneratedImages',
	{
		Last_GeneratedImage_ID: last_generatedimage_id
	}, delegator );
} 

function ImageManagement_PartitionImages( last_image_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'imagemanagement', 'ImageManagement_PartitionImages',
	{
		Last_Image_ID: last_image_id
	}, delegator );
}

function ImageManagement_PartitionGeneratedImages( last_generatedimage_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'imagemanagement', 'ImageManagement_PartitionGeneratedImages',
	{
		Last_GeneratedImage_ID: last_generatedimage_id
	}, delegator );
}
