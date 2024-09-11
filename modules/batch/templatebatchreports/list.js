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

// TemplateBatchReport List
////////////////////////////////////////////////////

function TemplateBatchReportList()
{
	var action_add, action_edittemplate;

	MMList.call( this, 'mm_list_templatebatchreportlist' );

	if ( CanI( 'SUTL', 0, 0, 1, 0 ) )
	{
		action_add = this.Feature_Controls_Create_Action( 'Add Report', '', this.Add );

		this.Feature_Controls_SetPrimary_Action( action_add );
		this.Feature_EditDialog_Enable( 'Edit Report' );
	}

	if ( CanI( 'PAGE', 1, 0, 0, 0 ) )
	{
		action_edittemplate = this.Feature_Selection_Create_Action_SingleSelect( 'Edit Template', 'Edit Template', this.EditTemplate );
		action_edittemplate.SetAllowMiddleClick( true );

		this.Feature_Selection_SetSecondary_Action( action_edittemplate );
	}

	if ( CanI( 'SUTL', 0, 0, 1, 0 ) )
	{
		this.Feature_Delete_Enable( 'Delete Report(s)' );
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Reports...' );
	this.SetDefaultSort( 'type' );
}

DeriveFrom( MMList, TemplateBatchReportList );

TemplateBatchReportList.prototype.onLoad = TemplateBatchReportList_Load_Query;

TemplateBatchReportList.prototype.Add = function()
{
	var self = this;
	var templatebatchreportadd;

	templatebatchreportadd			= new TemplateBatchReport_AddEditDialog( null, false, false );
	templatebatchreportadd.onsave	= function()
	{
		self.Refresh();
	}

	templatebatchreportadd.Show();
}

TemplateBatchReportList.prototype.onDelete = function( item, callback, delegator )
{
	TemplateBatchReport_Delete( item.record.type, item.record.code, callback, delegator );
}

TemplateBatchReportList.prototype.EditTemplate = function( item, e )
{
	return OpenLinkHandler( e, adminurl, { 'Screen': 'PAGE', 'Store_Code': Store_Code, 'Edit_Page': item.record.page_code } );
}

TemplateBatchReportList.prototype.onEdit = function( item )
{
	var self = this;
	var templatebatchreportedit;

	templatebatchreportedit				= new TemplateBatchReport_AddEditDialog( item.record );
	templatebatchreportedit.onsave		= function()
	{
		self.Refresh();
	}

	templatebatchreportedit.ondelete	= function()
	{
		self.Refresh();
	}

	templatebatchreportedit.Show();
}

TemplateBatchReportList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new TemplateBatchReportList_Column_Type( 'Type', 'type' ),
		new MMList_Column_Name( 'Name', 'name' )
			.SetNavigationEnabled( true )
	];

	return columnlist;
}

// Template Batch Report Type Column 
////////////////////////////////////////////////////

function TemplateBatchReportList_Column_Type( header_text, code, fieldname )
{
	var self = this;

	MMList_Column_Text.call( this, header_text, code, fieldname );

	this.SetOnDisplayData( function( record ) { return self.Display_Data( record ); } );
	this.SetOnDisplayEdit( function( record ) { return self.Display_Edit( record ); } );
}

DeriveFrom( MMList_Column_Text, TemplateBatchReportList_Column_Type );

TemplateBatchReportList_Column_Type.prototype.Display_Data = function( record )
{
	switch ( record.type )
	{
		case 'order'	: return DrawMMListString_Data( 'Order' );
		case 'shipment'	: return DrawMMListString_Data( 'Shipment' );
	}

	return DrawMMListString_Data( record.type );
}

TemplateBatchReportList_Column_Type.prototype.Display_Edit = function( record )
{
	var select;
	
	select				= newElement( 'select',		{ 'name': 'type' }, null, null );
	select.options[ 0 ]	= new Option( 'Order',		'order' );
	select.options[ 1 ]	= new Option( 'Shipment',	'shipment' );

	switch ( record.type )
	{
		case 'order'	: select.selectedIndex = 0;	break;
		case 'shipment'	: select.selectedIndex = 1;	break;
	}

	return select;
}

TemplateBatchReportList_Column_Type.prototype.onAdvancedSearch_Filter_AddOptions = function()
{
	this.AdvancedSearch_Filter_AddOption( 'Equal To',		'EQ' );
	this.AdvancedSearch_Filter_AddOption( 'Not Equal To',	'NE' );
}

TemplateBatchReportList_Column_Type.prototype.onAdvancedSearch_ConstructValue = function()
{
	return this.AdvancedSearch_ConstructValue_Select();
}

TemplateBatchReportList_Column_Type.prototype.AdvancedSearch_ConstructValue_Select_OnPopulate = function( select )
{
	select.AddOption( 'Order',		'order' );
	select.AddOption( 'Shipment',	'shipment' );
}
