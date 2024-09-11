// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2021 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function TemplateSearchAndReplace_Find( last_template_id, search_text, match_case, callback, delegator )					
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'srchrplc', 'TemplateSearchAndReplace_Find',
	{
		LastTemplateID:		last_template_id,
		SearchText:			search_text,
		MatchCase:			match_case
	}, delegator );
}

function TemplateSearchAndReplace_Replace( replace_text, notes, templates, callback, delegator )					
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'srchrplc', 'TemplateSearchAndReplace_Replace',
	{
		ReplaceText:	replace_text,
		Notes:			notes,
		Templates:		templates
	}, delegator );
}