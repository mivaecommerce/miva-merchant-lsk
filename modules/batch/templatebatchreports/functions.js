// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2015 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function TemplateBatchReportList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module(	callback,
								'admin',
								'templatebatchreports',
								'TemplateBatchReportList_Load_Query',
								'Filter=' 	+ EncodeArray( filter ) 		+
								'&Sort=' 	+ encodeURIComponent( sort ) 	+
								'&Offset=' 	+ encodeURIComponent( offset ) 	+
								'&Count=' 	+ encodeURIComponent( count ),
								delegator
	);
}
 
function TemplateBatchReport_Insert( type, code, name, callback )
{
	return AJAX_Call_Module(	callback,
								'admin',
								'templatebatchreports',
								'TemplateBatchReport_Insert',
								'Type=' 	+ encodeURIComponent( type ) +
								'&Code=' 	+ encodeURIComponent( code ) +
								'&Name=' 	+ encodeURIComponent( name )
	);
}

function TemplateBatchReport_Update( report_type, report_code, name, callback )
{
	return AJAX_Call_Module(	callback,
								'admin',
								'templatebatchreports',
								'TemplateBatchReport_Update',
								'Report_Type=' 	+ encodeURIComponent( report_type ) +
								'&Report_Code=' + encodeURIComponent( report_code ) +
								'&Name=' 		+ encodeURIComponent( name )
	);
}

function TemplateBatchReport_Delete( report_type, report_code, callback, delegator )
{
	return AJAX_Call_Module(	callback,
								'admin',
								'templatebatchreports',
								'TemplateBatchReport_Delete',
								'Report_Type=' 	+ encodeURIComponent( report_type ) +
								'&Report_Code=' + encodeURIComponent( report_code ),
								delegator
	);
}
