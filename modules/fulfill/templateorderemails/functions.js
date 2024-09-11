// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2023 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function TemplateOrderEmailList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'templateorderemails', 'TemplateOrderEmailList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function TemplateOrderEmail_Insert( data, callback )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'templateorderemails', 'TemplateOrderEmail_Insert',
	{
		Code: 						data.code,
		Name: 						data.name,
		Email_From: 				data.email_from,
		Email_Reply_To: 			data.email_reply_to,
		Email_To: 					data.email_to,
		Email_CC: 					data.email_cc,
		Email_BCC: 					data.email_bcc,
		Email_Subject: 				data.email_subject,
		Mime_Type: 					data.mime_type,
		Enabled: 					data.enabled,
		On_Order_Sources: 			data.on_order_sources,
		On_Order_Backordered: 		data.on_bord,
		On_Return_Authorized: 		data.on_retc,
		On_Return_Received: 		data.on_retr,
		On_Shipment_Created: 		data.on_shpc,
		On_Shipment_Shipped: 		data.on_shps,
		On_Customer_Created: 		data.on_cust,
		On_AbandonedBasket:			data.on_abandon,
		On_GiftCertificate_Created:	data.on_gftcert,
		On_DigitalDownload_Created:	data.on_digital,
		On_Subscription_Created:	data.on_sub_crt,
		On_Subscription_Changed:	data.on_sub_chg,
		On_Subscription_Cancelled:	data.on_sub_can,
		On_Subscription_OutOfStock:	data.on_sub_oos,
		On_Subscription_Pending:	data.on_sub_pnd,
		Subscription_Days:			data.sub_days,
		On_PaymentCard_Expired:		data.on_pc_exp,
		PaymentCard_Type:			data.pc_type,
		PaymentCard_Days:			data.pc_days,
		Abandoned_Time:				data.ab_time,
		Abandoned_MinSubtotal:		data.ab_minsub,
		Abandoned_MaxSubtotal:		data.ab_maxsub,
		Abandoned_KeepAlive: 		data.ab_kpalive,
		Abandoned_AliveMins:		data.ab_kpmins,
		On_AuthFail_Sources:		data.on_authfail_sources,
		Send_Base64_Encoded: 		data.send_b64,
		Visible_For_Customers:		data.vis_cust,
		Visible_For_Orders:			data.vis_ordr,
	} );
}

function TemplateOrderEmail_Update( data, callback )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'templateorderemails', 'TemplateOrderEmail_Update',
	{
		Email_Code: 				data.code,
		Name: 						data.name,
		Email_From: 				data.email_from,
		Email_Reply_To: 			data.email_reply_to,
		Email_To:					data.email_to,
		Email_CC: 					data.email_cc,
		Email_BCC: 					data.email_bcc,
		Email_Subject:				data.email_subject,
		Mime_Type: 					data.mime_type,
		Enabled: 					data.enabled,
		On_Order_Sources: 			data.on_order_sources,
		On_Order_Backordered: 		data.on_bord,
		On_Return_Authorized: 		data.on_retc,
		On_Return_Received: 		data.on_retr,
		On_Shipment_Created: 		data.on_shpc,
		On_Shipment_Shipped: 		data.on_shps,
		On_Customer_Created: 		data.on_cust,
		On_AbandonedBasket:			data.on_abandon,
		On_GiftCertificate_Created:	data.on_gftcert,
		On_DigitalDownload_Created:	data.on_digital,
		On_Subscription_Created:	data.on_sub_crt,
		On_Subscription_Changed:	data.on_sub_chg,
		On_Subscription_Cancelled:	data.on_sub_can,
		On_Subscription_OutOfStock:	data.on_sub_oos,
		On_Subscription_Pending:	data.on_sub_pnd,
		Subscription_Days:			data.sub_days,
		On_PaymentCard_Expired:		data.on_pc_exp,
		PaymentCard_Type:			data.pc_type,
		PaymentCard_Days:			data.pc_days,
		Abandoned_Time:				data.ab_time,
		Abandoned_MinSubtotal:		data.ab_minsub,
		Abandoned_MaxSubtotal:		data.ab_maxsub,
		Abandoned_KeepAlive: 		data.ab_kpalive,
		Abandoned_AliveMins:		data.ab_kpmins,
		On_AuthFail_Sources:		data.on_authfail_sources,
		Send_Base64_Encoded: 		data.send_b64,
		Visible_For_Customers:		data.vis_cust,
		Visible_For_Orders:			data.vis_ordr
	} );
}

function TemplateOrderEmail_Delete( email_code, callback, delegator )
{
	return AJAX_Call_Module(   callback,
							   'admin',
							   'templateorderemails',
							   'TemplateOrderEmail_Delete',
							   'Email_Code=' + encodeURIComponent( email_code ),
							   delegator );
}

function TemplateOrderEmail_Update_Enabled( code, enabled, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'templateorderemails', 'TemplateOrderEmail_Update_Enabled',
	{
		Email_Code:	code,
		Enabled:	enabled
	}, delegator );
}
