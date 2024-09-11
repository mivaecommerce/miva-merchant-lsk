// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2020 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function ImageManagement_ImageList_Load_Query( filter, sort, offset, count, callback, delegator )					
{
	return AJAX_Call_Module( callback, 'admin',
							 'imagemanagement',
							 'ImageManagement_ImageList_Load_Query',
							 'Filter=' + EncodeArray( filter ) +
							 '&Sort=' + encodeURIComponent( sort ) +
							 '&Offset=' + encodeURIComponent( offset ) +
							 '&Count=' + encodeURIComponent( count ),
							 delegator );
}

function ImageManagement_Image_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
						     'admin',
						     'imagemanagement',
						     'ImageManagement_Image_Delete',
						     'Image_ID=' + encodeURIComponent( id ),
							 delegator );
}

function ImageManagement_ImageList_Delete_GeneratedImages( image_ids, callback )
{
	return AJAX_Call_Module( callback, 'admin',
						   	 'imagemanagement',
						   	 'ImageManagement_ImageList_Delete_GeneratedImages',
						   	 'Image_IDs=' + EncodeArray( image_ids ) );
}

function ImageManagement_Delete_UnreferencedImages( callback )
{
	return AJAX_Call_Module( callback, 'admin',
							 'imagemanagement',
							 'ImageManagement_Delete_UnreferencedImages',
							 '' );
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

function ImageManagement_GeneratedImageList_Load_Image( image_id, callback )
{
	return AJAX_Call_Module( callback, 'admin',
							 'imagemanagement',
							 'ImageManagement_GeneratedImageList_Load_Image',
							 'Image_ID=' + encodeURIComponent( image_id ) );
}

function ImageManagement_GeneratedImageList_Delete( generatedimage_ids, callback )
{
	return AJAX_Call_Module( callback, 'admin',
							 'imagemanagement',
							 'ImageManagement_GeneratedImageList_Delete',
							 'GeneratedImage_IDs=' + EncodeArray( generatedimage_ids ) );
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
