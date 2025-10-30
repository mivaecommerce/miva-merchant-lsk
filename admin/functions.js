// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2025 Miva, Inc.  All rights reserved.
// http://www.miva.com
//
// Prefix         : MER-ADM-FCN-
// Next Error Code: 3    
//

// Order Processing Server-side AJAX calls
////////////////////////////////////////////////////

function BatchList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'BatchList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function BatchReportList_Load_Orders( batch_id, callback )							{ return AJAX_Call( callback, 'admin', 'BatchReportList_Load_Orders',			'Batch_ID=' + encodeURIComponent( batch_id ) ); }

function Batch_Insert( name, callback )
{
	return AJAX_Call_JSON( callback, 'admin', 'Batch_Insert',
	{
		Batch_Name: name
	} );
}

function ShipmentBatchList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ShipmentBatchList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function ShipmentBatchReportList_Load( callback )									{ return AJAX_Call( callback, 'admin', 'ShipmentBatchReportList_Load',			'' ); }

function ShipmentBatch_Insert( shipmentbatch_name, callback )
{
	return AJAX_Call_JSON( callback, 'admin', 'ShipmentBatch_Insert',
	{
		ShipmentBatch_Name: shipmentbatch_name
	} );
}

function OrderCustomFieldList_Load( callback, delegator )							{ return AJAX_Call( callback, 'admin', 'OrderCustomFieldList_Load',				'', delegator ); }
function OrderCustomFields_Update( order_id, fieldlist, callback, delegator )		{ return AJAX_Call_FieldList( callback, 'admin', 'OrderCustomFields_Update',	'Order_ID=' + encodeURIComponent( order_id ), fieldlist, delegator ); }
function Order_Load_ID( order_id, callback, delegator )								{ return AJAX_Call( callback, 'admin', 'Order_Load_ID',							'Order_ID=' + encodeURIComponent( order_id ), delegator ); }
function OrderIndex_Load_ID( order_id, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderIndex_Load_ID',
	{
		Order_ID:	order_id,
		Filter:		filter,
		Sort:		sort
	}, delegator );
}

function OrderList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function OrderList_Load_ItemsPending( offset, count, callback )						{ return AJAX_Call( callback, 'admin', 'OrderList_Load_ItemsPending',			'Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ) ); }
function OrderList_Load_ItemsBackordered( offset, count, callback )					{ return AJAX_Call( callback, 'admin', 'OrderList_Load_ItemsBackordered',		'Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ) ); }
function OrderItemList_Load( order_id, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'OrderItemList_Load',					'Order_ID=' + encodeURIComponent( order_id ), delegator ); }
function OrderItemList_Load_Status( order_id, status, callback )					{ return AJAX_Call( callback, 'admin', 'OrderItemList_Load_Status',				'Order_ID=' + encodeURIComponent( order_id ) + '&Status=' + encodeURIComponent( status ) ); }
function OrderItemList_Load_Shipment( order_id, shipment_id, callback )				{ return AJAX_Call( callback, 'admin', 'OrderItemList_Load_Shipment',			'Order_ID=' + encodeURIComponent( order_id ) + '&Shipment_ID=' + encodeURIComponent( shipment_id ) ); }
function OrderItemList_Load_Return( order_id, return_id, callback )					{ return AJAX_Call( callback, 'admin', 'OrderItemList_Load_Return',				'Order_ID=' + encodeURIComponent( order_id ) + '&Return_ID=' + encodeURIComponent( return_id ) ); }
function OrderChargeList_Load( order_id, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'OrderChargeList_Load',					'Order_ID=' + encodeURIComponent( order_id ), delegator ); }
function OrderChargeList_Load_Type( order_id, type, callback )						{ return AJAX_Call( callback, 'admin', 'OrderChargeList_Load_Type',				'Order_ID=' + encodeURIComponent( order_id ) + '&Type=' + encodeURIComponent( type ) ); }
function OrderPaymentList_Load( order_id, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'OrderPaymentList_Load',					'Order_ID=' + encodeURIComponent( order_id ), delegator ); }
function OrderPaymentFieldList_Load( orderpayment_id, passphrase, callback )		{ return AJAX_Call( callback, 'admin', 'OrderPaymentFieldList_Load',			'OrderPayment_ID=' + encodeURIComponent( orderpayment_id ) + '&Passphrase=' + encodeURIComponent( passphrase ) ); }
function EncryptionKey_Load( encryption_id, callback )								{ return AJAX_Call( callback, 'admin', 'EncryptionKey_Load',					'Encryption_ID=' + encodeURIComponent( encryption_id ) ); }
function EncryptionKeyList_Load_Batch( batch_id, callback )							{ return AJAX_Call( callback, 'admin', 'EncryptionKeyList_Load_Batch',			'Batch_ID=' + encodeURIComponent( batch_id ) ); }

function EncryptionKeyList_Load_OrderList( order_ids, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'EncryptionKeyList_Load_OrderList',
	{
		Order_IDs:	order_ids
	}, delegator );
}

function EncryptionKeyList_Load_Capture_Batch( batch_id, callback )
{
	return AJAX_Call( callback, 'admin', 'EncryptionKeyList_Load_Capture_Batch', 'Batch_ID=' + encodeURIComponent( batch_id ) );
}

function EncryptionKeyList_Load_Capture_OrderList( order_ids, callback )
{
	var i, i_len;
	var error, cb_response, delegator;

	error					= false;
	cb_response				= null;
	chunk_size				= 1000;
	delegator				= new AJAX_ThreadPool( 3 );
	delegator.onComplete	= function() { callback( cb_response );	};

	for ( i = 0, i_len = order_ids.length; i < i_len; i += chunk_size )
	{
		EncryptionKeyList_Load_Capture_OrderList_LowLevel( order_ids.slice( i, i + chunk_size ), function( response )
		{
			var j, j_len;

			if ( error || !response.success )
			{
				if ( !error )
				{
					delegator.Cancel();

					error 			= true;
					cb_response 	= response;
				}

				return;
			}

			if ( cb_response === null )
			{
				cb_response = response;
			}
			else
			{
				for ( j = 0, j_len = response.data.length; j < j_len; j++ )
				{
					if ( !arrayFind( cb_response.data, function( key ) { return key.id == response.data[ j ].id; } ) )
					{
						cb_response.data.push( response.data[ j ] );
					}
				}
			}
		}, delegator );
	}

	delegator.Run();
}

function EncryptionKeyList_Load_Capture_OrderList_LowLevel( order_ids, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'EncryptionKeyList_Load_Capture_OrderList',
	{
		Order_IDs:	order_ids
	}, delegator );
}

function OrderList_Load_EncryptionKey_Query( encryptionkey_id, filter, sort, offset, count, callback, 
							   delegator )											{ return AJAX_Call( callback, 'admin', 'OrderList_Load_EncryptionKey_Query',	'EncryptionKey_ID=' + encodeURIComponent( encryptionkey_id ) + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }

function OrderList_CreateShipment_Status( order_ids, status, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderList_CreateShipment_Status',
	{
		Order_IDs:	order_ids,
		Status:		status
	}, delegator );
}

function OrderList_Delete_OrderPayments( order_ids, callback )						{ return AJAX_Call( callback, 'admin', 'OrderList_Delete_OrderPayments',		'Order_IDs=' + EncodeArray( order_ids ) ); }

function OrderList_Archive( order_ids, data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderList_Archive',
	{
		Order_IDs:				order_ids,
		Delete_Payment_Data:	data.payment_data,
		Delete_Shipping_Labels:	data.shipping_labels
	}, delegator );
}

function OrderItemList_Delete( order_id, line_ids, callback, delegator )			{ return AJAX_Call( callback, 'admin', 'OrderItemList_Delete',					'Order_ID=' + encodeURIComponent( order_id ) + '&Line_IDs=' + EncodeArray( line_ids ), delegator ); }
function OrderItemList_Cancel( order_id, line_ids, reason, callback )				{ return AJAX_Call( callback, 'admin', 'OrderItemList_Cancel',					'Order_ID=' + encodeURIComponent( order_id ) + '&Line_IDs=' + EncodeArray( line_ids ) + '&Reason=' + encodeURIComponent( reason ) ); }

function OrderItem_Split( order_id, line_id, quantity, callback )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderItem_Split',
	{
		Order_ID:	order_id,
		Line_ID:	line_id,
		Quantity:	quantity
	} );
}

function OrderItemList_CreateShipment( order_id, line_ids, callback )				{ return AJAX_Call( callback, 'admin', 'OrderItemList_CreateShipment',			'Order_ID=' + encodeURIComponent( order_id ) + '&Line_IDs=' + EncodeArray( line_ids ) ); }

function OrderItemList_RemoveFromShipment( order_id, line_ids, callback )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderItemList_RemoveFromShipment',
	{
		Order_ID: order_id,
		Line_IDs: line_ids
	} );
}

function OrderList_BackOrder_Status( order_ids, status, date_instock, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderList_BackOrder_Status',
	{
		Order_IDs:		order_ids,
		Status:			status,
		Date_InStock:	date_instock
	}, delegator );
}

function OrderItemList_BackOrder( order_id, line_ids, date_instock, callback )		{ return AJAX_Call( callback, 'admin', 'OrderItemList_BackOrder',				'Order_ID=' + encodeURIComponent( order_id ) + '&Line_IDs=' + EncodeArray( line_ids ) + '&Date_InStock=' + encodeURIComponent( date_instock ) ); }
function OrderItemList_CreateReturn( order_id, line_ids, callback )					{ return AJAX_Call( callback, 'admin', 'OrderItemList_CreateReturn',			'Order_ID=' + encodeURIComponent( order_id ) + '&Line_IDs=' + EncodeArray( line_ids ) ); }
function OrderShipmentIndex_Load_ID( shipment_id, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderShipmentIndex_Load_ID',
	{
		Shipment_ID:	shipment_id,
		Filter:			filter,
		Sort:			sort
	}, delegator );
}

function OrderShipmentList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderShipmentList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function OrderShipmentList_Load_Order( order_id, callback )							{ return AJAX_Call( callback, 'admin', 'OrderShipmentList_Load_Order',			'Order_ID=' + encodeURIComponent( order_id ) ); }
function OrderShipmentList_Load_ShipmentBatch( shipmentbatch_id, callback )			{ return AJAX_Call( callback, 'admin', 'OrderShipmentList_Load_ShipmentBatch',	'ShipmentBatch_ID=' + encodeURIComponent( shipmentbatch_id ) ); }
function OrderShipmentList_Update( shipment_ids, mark_shipped,
								   carrier_list, tracking_list,
								   tracktype_list, cost_list,
								   callback )										{ return AJAX_Call( callback, 'admin', 'OrderShipmentList_Update',				'Shipment_IDs=' + EncodeArray( shipment_ids ) +
																																									'&Mark_Shipped=' + EncodeArray( mark_shipped ) +
																																									'&Carrier_List=' + EncodeArray( carrier_list ) +
																																									'&Tracking_List=' + EncodeArray( tracking_list ) +
																																									'&TrackingType_List=' + EncodeArray( tracktype_list ) +
																																									'&Cost_List=' + EncodeArray( cost_list ) ); }
function OrderShipmentList_Return( shipment_ids, callback )							{ return AJAX_Call( callback, 'admin', 'OrderShipmentList_Return',				'Shipment_IDs=' + EncodeArray( shipment_ids ) ); }

function OrderShipmentList_Update_Batch( batch_id, shipment_ids, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderShipmentList_Update_Batch',
	{
		Batch_ID:		batch_id,
		Shipment_IDs:	shipment_ids
	}, delegator );
}

function OrderShipment_GenerateLabels( from_addr, to_addr,
									   module_id, module_data, shipment_id,
									   mark_shipped, package_widths,
									   package_lengths, package_heights,
									   package_weights, package_modulebox_codes,
									   package_field_prefixes, package_product_ids,
									   fields, callback )							{ return AJAX_Call_FieldList( callback, 'admin', 'OrderShipment_GenerateLabels',
																																									'From:name=' + encodeURIComponent( from_addr.name ) + '&From:email=' + encodeURIComponent( from_addr.email ) + '&From:phone=' + encodeURIComponent( from_addr.phone ) + '&From:fax=' + encodeURIComponent( from_addr.fax ) + '&From:company=' + encodeURIComponent( from_addr.company ) + '&From:addr1=' + encodeURIComponent( from_addr.addr1 ) + '&From:addr2=' + encodeURIComponent( from_addr.addr2 ) + '&From:city=' + encodeURIComponent( from_addr.city ) + '&From:state=' + encodeURIComponent( from_addr.state ) + '&From:zip=' + encodeURIComponent( from_addr.zip ) + '&From:country=' + encodeURIComponent( from_addr.country ) +
																																									'&To:name=' + encodeURIComponent( to_addr.name ) + '&To:email=' + encodeURIComponent( to_addr.email ) + '&To:phone=' + encodeURIComponent( to_addr.phone ) + '&To:fax=' + encodeURIComponent( to_addr.fax ) + '&To:company=' + encodeURIComponent( to_addr.company ) + '&To:addr1=' + encodeURIComponent( to_addr.addr1 ) + '&To:addr2=' + encodeURIComponent( to_addr.addr2 ) + '&To:city=' + encodeURIComponent( to_addr.city ) + '&To:state=' + encodeURIComponent( to_addr.state ) + '&To:zip=' + encodeURIComponent( to_addr.zip ) + '&To:country=' + encodeURIComponent( to_addr.country ) + '&To:residential=' + ( to_addr.residential ? '1' : '0' ) +
																																									'&Module_ID=' + encodeURIComponent( module_id ) + '&Module_Data=' + encodeURIComponent( module_data ) + '&Shipment_ID=' + encodeURIComponent( shipment_id ) + '&Mark_Shipped=' + encodeURIComponent( mark_shipped ) +
																																									'&Package_Widths=' + EncodeArray( package_widths ) + '&Package_Lengths=' + EncodeArray( package_lengths ) + '&Package_Heights=' + EncodeArray( package_heights ) + '&Package_Weights=' + EncodeArray( package_weights ) +
																																									'&Package_ModuleBox_Codes=' + EncodeArray( package_modulebox_codes ) + '&Package_Field_Prefixes=' + EncodeArray( package_field_prefixes ) +
																																									'&Package_Product_IDs=' + EncodeTwoDimensionalArray( package_product_ids ), fields ); }
function OrderShipmentLabelList_Load_Shipment( shipment_id, callback )				{ return AJAX_Call( callback, 'admin', 'OrderShipmentLabelList_Load_Shipment',	'Shipment_ID=' + encodeURIComponent( shipment_id ) ); }
function OrderShipmentLabel_Void_Shipment( shipment_id, callback )					{ return AJAX_Call( callback, 'admin', 'OrderShipmentLabel_Void_Shipment',		'Shipment_ID=' + encodeURIComponent( shipment_id ) ); }

function OrderReturnList_Load( offset, count, callback )							{ return AJAX_Call( callback, 'admin', 'OrderReturnList_Load',					'Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ) ); }
function OrderReturnList_Load_Order( order_id, callback )							{ return AJAX_Call( callback, 'admin', 'OrderReturnList_Load_Order',			'Order_ID=' + encodeURIComponent( order_id ) ); }
function OrderReturnList_Received( return_ids, inventory_adjustments, callback )	{ return AJAX_Call( callback, 'admin', 'OrderReturnList_Received',				'Return_IDs=' + EncodeArray( return_ids ) + '&Inventory_Adjustments=' + EncodeArray( inventory_adjustments ) ); }

function OrderReturn_Cancel( return_id, callback )									{ return AJAX_Call( callback, 'admin', 'OrderReturn_Cancel',					'Return_ID=' + encodeURIComponent( return_id ) ); }

function Order_Create_Empty( callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Order_Create_Empty', null, delegator );
}

function Order_Create_FromOrder( order_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Order_Create_FromOrder',
	{
		Order_ID: order_id
	}, delegator );
}

function Order_Create_Empty_Customer( cust_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Order_Create_Empty',
	{
		Customer_ID: cust_id
	}, delegator );
}

function Order_Delete( order_id, callback, delegator )								{ return AJAX_Call( callback, 'admin', 'Order_Delete',							'Order_ID=' + encodeURIComponent( order_id ), delegator ); }
function OrderList_Delete( order_ids, callback, delegator )							{ return AJAX_Call( callback, 'admin', 'OrderList_Delete',						'Order_IDs=' + EncodeArray( order_ids ), delegator ); }

function OrderList_Update_Batch( batch_id, order_ids, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderList_Update_Batch',
	{
		Batch_ID:	batch_id,
		Order_IDs:	order_ids
	}, delegator );
}

function Order_Update_Customer_Information( order, callback )
{
	return AJAX_Call_JSON( callback, 'admin', 'Order_Update_Customer_Information',
   {
		Order_ID:			order.id,
		Customer_ID:		order.cust_id,
		Ship_Residential:	order.ship_res,
		Ship_FirstName:		order.ship_fname,
		Ship_LastName:		order.ship_lname,
		Ship_Email:			order.ship_email,
		Ship_Phone:			order.ship_phone,
		Ship_Fax:			order.ship_fax,
		Ship_Company:		order.ship_comp,
		Ship_Address1:		order.ship_addr1,
		Ship_Address2:		order.ship_addr2,
		Ship_City:			order.ship_city,
		Ship_State:			order.ship_state,
		Ship_Zip:			order.ship_zip,
		Ship_Country:		order.ship_cntry,
		Bill_FirstName:		order.bill_fname,
		Bill_LastName:		order.bill_lname,
		Bill_Email:			order.bill_email,
		Bill_Phone:			order.bill_phone,
		Bill_Fax:			order.bill_fax,
		Bill_Company:		order.bill_comp,
		Bill_Address1:		order.bill_addr1,
		Bill_Address2:		order.bill_addr2,
		Bill_City:			order.bill_city,
		Bill_State:			order.bill_state,
		Bill_Zip:			order.bill_zip,
		Bill_Country:		order.bill_cntry
	} );
}

function Order_Recalculate_Tax( order_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Order_Recalculate_Tax',
	{
		Order_ID: order_id
	}, delegator );
}

function Order_Recalculate_Charges( order_id, ship_module, ship_data, callback )	{ return AJAX_Call( callback, 'admin', 'Order_Recalculate_Charges',				'Order_ID=' + encodeURIComponent( order_id ) + '&Shipping_Module=' + encodeURIComponent( ship_module ) + '&Shipping_Data=' + encodeURIComponent( ship_data ) ); }
function Order_Update_Charges( order_id,
							   ship_id, ship_data,
							   module_ids, types, descrips, amounts, tax_exempts, taxes,
							   callback )											{ return AJAX_Call( callback, 'admin', 'Order_Update_Charges',					'Order_ID=' + encodeURIComponent( order_id ) +
																																									'&Shipping_ID=' + encodeURIComponent( ship_id ) + '&Shipping_Data=' + encodeURIComponent( ship_data ) + 
																																									'&Charge_Module_IDs=' + EncodeArray( module_ids ) + '&Charge_Types=' + EncodeArray( types ) + '&Charge_Descriptions=' + EncodeArray( descrips ) + '&Charge_Amounts=' + EncodeArray( amounts ) + '&Charge_Tax_Exempts=' + EncodeArray( tax_exempts ) + '&Charge_Taxes=' + EncodeArray( taxes ) ); }
function Order_FulfillmentModule_Process( order_id, module_ids, callback )			{ return AJAX_Call( callback, 'admin', 'Order_FulfillmentModule_Process',		'Order_ID=' + encodeURIComponent( order_id ) + '&Module_IDs=' + EncodeArray( module_ids ) ); }
function Order_Authorize( order_id, module_id, module_data,
						  amount, fields, callback )								{ return AJAX_Call_FieldList( callback, 'admin', 'Order_Authorize',				'Order_ID=' + encodeURIComponent( order_id ) + '&Module_ID=' + encodeURIComponent( module_id ) + '&Module_Data=' + encodeURIComponent( module_data ) + '&Amount=' + encodeURIComponent( amount ), fields ); }

function Order_Authorize_GenerateMivaPayRequest( order_id, paymentcardtype_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Order_Authorize_GenerateMivaPayRequest',
	{
		Order_ID:			order_id,
		PaymentCardType_ID:	paymentcardtype_id
	}, delegator );
}

function Order_UnlinkSubscriptions( order_id, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'Order_UnlinkSubscriptions',
					  'Order_ID=' + encodeURIComponent( order_id ),
					  delegator );
}

function Order_CancelSubscriptions( order_id, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'Order_CancelSubscriptions',
					  'Order_ID=' + encodeURIComponent( order_id ),
					  delegator );
}

function Order_TransferSubscriptions( order_id, cust_id, custpc_id, addr_id, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'Order_TransferSubscriptions',
					  'Order_ID='			+ encodeURIComponent( order_id )	+
					  '&Customer_ID=' 		+ encodeURIComponent( cust_id )		+
					  '&PaymentCard_ID=' 	+ encodeURIComponent( custpc_id )	+
					  '&Address_ID=' 		+ encodeURIComponent( addr_id ),
					  delegator );
}

function OrderPayment_Capture( orderpayment_id, amount, passphrase, callback )		{ return AJAX_Call( callback, 'admin', 'OrderPayment_Capture',					'OrderPayment_ID=' + encodeURIComponent( orderpayment_id ) + '&Amount=' + encodeURIComponent( amount ) + '&Passphrase=' + encodeURIComponent( passphrase ) ); }
function OrderPayment_Refund( orderpayment_id, amount, passphrase, callback )		{ return AJAX_Call( callback, 'admin', 'OrderPayment_Refund',					'OrderPayment_ID=' + encodeURIComponent( orderpayment_id ) + '&Amount=' + encodeURIComponent( amount ) + '&Passphrase=' + encodeURIComponent( passphrase ) ); }
function OrderPayment_VOID( orderpayment_id, amount, passphrase, callback )			{ return AJAX_Call( callback, 'admin', 'OrderPayment_VOID',						'OrderPayment_ID=' + encodeURIComponent( orderpayment_id ) + '&Amount=' + encodeURIComponent( amount ) + '&Passphrase=' + encodeURIComponent( passphrase ) ); }

function OrderTabList_Load( order_id, callback, delegator )							{ return AJAX_Call( callback, 'admin', 'OrderTabList_Load',						'Order_ID=' + encodeURIComponent( order_id ), delegator ); }

function PaymentMethodList_Load( callback )											{ return AJAX_Call( callback, 'admin', 'PaymentMethodList_Load',				'' ); }
function PaymentMethodList_Load_Order( order_id, callback )							{ return AJAX_Call( callback, 'admin', 'PaymentMethodList_Load',				'Order_ID=' + encodeURIComponent( order_id ) ); }
function PaymentMethodList_Load_OnSite( callback )									{ return AJAX_Call( callback, 'admin', 'PaymentMethodList_Load_OnSite',			'' ); }
function PaymentMethodList_Load_OnSite_Order( order_id, callback )					{ return AJAX_Call( callback, 'admin', 'PaymentMethodList_Load_OnSite',			'Order_ID=' + encodeURIComponent( order_id ) ); }
function PaymentMethodFieldList_Load( module_id, module_data, callback )			{ return AJAX_Call( callback, 'admin', 'PaymentMethodFieldList_Load',			'Module_ID=' + encodeURIComponent( module_id ) + '&Module_Data=' + encodeURIComponent( module_data ) ); }
function PaymentMethodFieldList_Load_Order( order_id, module_id,
											module_data, callback )					{ return AJAX_Call( callback, 'admin', 'PaymentMethodFieldList_Load',			'Order_ID=' + encodeURIComponent( order_id ) + '&Module_ID=' + encodeURIComponent( module_id ) + '&Module_Data=' + encodeURIComponent( module_data ) ); }

function OrderList_Capture_Batch( batch_id, last_order_id, key_ids, passphrases, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderList_Capture_Batch',
	{
		Batch_ID:		batch_id,
		Last_Order_ID:	last_order_id,
		Key_IDs:		key_ids,
		Passphrases:	passphrases
	}, delegator );
}

function OrderList_Capture( order_ids, key_ids, passphrases, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderList_Capture',
	{
		Order_IDs:		order_ids,
		Key_IDs:		key_ids,
		Passphrases:	passphrases
	}, delegator );
}

function OrderItem_Add( order_id,
						code, name, 
						quantity, weight, taxable, price,
						attributes, options, weights, prices,
						callback )													{ return AJAX_Call( callback, 'admin', 'OrderItem_Add',							'Order_ID=' + encodeURIComponent( order_id ) +
																																									'&Code=' + encodeURIComponent( code ) + '&Name=' + encodeURIComponent( name ) +
																																									'&Quantity=' + encodeURIComponent( quantity ) + '&Weight=' + encodeURIComponent( weight ) + '&Price=' + encodeURIComponent( price ) + '&Taxable=' + encodeURIComponent( taxable ) +
																																									'&Attribute_Codes=' + EncodeArray( attributes ) + '&Attribute_Options=' + EncodeArray( options ) + '&Attribute_Weights=' + EncodeArray( weights ) + '&Attribute_Prices=' + EncodeArray( prices ) ); }
function v97_OrderItem_Add( order_id, data, callback )
{
	return AJAX_Call( callback, 'admin', 'OrderItem_Add',
					  'Order_ID='				+ encodeURIComponent( order_id )		+
					  '&Code='					+ encodeURIComponent( data.code )		+
					  '&Name='					+ encodeURIComponent( data.name )		+
					  '&SKU='					+ encodeURIComponent( data.sku )		+
					  '&Quantity='				+ encodeURIComponent( data.quantity )	+
					  '&Weight='				+ encodeURIComponent( data.weight )		+
					  '&Price='					+ encodeURIComponent( data.price )		+
					  '&Taxable='				+ encodeURIComponent( data.taxable )	+
					  '&Attribute_Codes='		+ EncodeArray( data.attributes )		+
					  '&Attribute_Options='		+ EncodeArray( data.options )			+
					  '&Attribute_Weights='		+ EncodeArray( data.weights )			+
					  '&Attribute_Prices='		+ EncodeArray( data.prices ) );
}

function v10_OrderItem_Add( order_id, data, callback, delegator )
{	
	return AJAX_Call_JSON( callback, 'admin', 'OrderItem_Add',
	{
		Order_ID:	order_id,
		Code:		data.code,
		Name:		data.name,
		SKU:		data.sku,
		Quantity:	data.quantity,
		Price:		data.price,
		Weight:		data.weight,
		Taxable:	data.taxable,
		Attributes:	data.attributes
	}, delegator );
}

function OrderItem_DetermineSKU( product_code, attributes, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OrderItem_DetermineSKU',
	{
		Product_Code:	product_code,
		Attributes:		attributes
	}, delegator );
}

function OrderItem_DetermineVariant( product_code, attributes, callback, delegator )
{	
	return AJAX_Call_JSON( callback, 'admin', 'OrderItem_DetermineVariant',
	{
		Product_Code:	product_code,
		Attributes:		attributes
	}, delegator );
}

function SubscriptionAndOrderItem_Add( order_id, data, callback )
{
	return AJAX_Call( callback, 'admin', 'SubscriptionAndOrderItem_Add',
					  'Order_ID='						+ encodeURIComponent( order_id )		+
					  '&Customer_ID='					+ encodeURIComponent( data.cust_id )	+
					  '&PaymentCard_ID='				+ encodeURIComponent( data.custpc_id )	+
					  '&Product_ID='					+ encodeURIComponent( data.product_id )	+
					  '&ProductSubscriptionTerm_ID='	+ encodeURIComponent( data.subterm_id )	+
					  '&Address_ID='					+ encodeURIComponent( data.addr_id )	+
					  '&Ship_ID='						+ encodeURIComponent( data.ship_id )	+
					  '&Ship_Data='						+ encodeURIComponent( data.ship_data )	+
					  '&Quantity='						+ encodeURIComponent( data.quantity )	+
					  '&NextDate='						+ encodeURIComponent( data.nextdate )	+
					  '&Template_Codes='				+ EncodeArray( data.template_codes )	+
					  '&Attribute_Codes='				+ EncodeArray( data.attr_codes )		+
					  '&Values='						+ EncodeArray( data.values ) );
}

function SubscriptionAndOrderItem_Update( order_id, line_id, subscrp_id, data, callback )
{
	return AJAX_Call( callback, 'admin', 'SubscriptionAndOrderItem_Update',
					  'Order_ID='						+ encodeURIComponent( order_id )		+
					  '&Line_ID='						+ encodeURIComponent( line_id )			+
					  '&Subscription_ID='				+ encodeURIComponent( subscrp_id )		+
					  '&Customer_ID='					+ encodeURIComponent( data.cust_id )	+
					  '&PaymentCard_ID='				+ encodeURIComponent( data.custpc_id )	+
					  '&Product_ID='					+ encodeURIComponent( data.product_id )	+
					  '&ProductSubscriptionTerm_ID='	+ encodeURIComponent( data.subterm_id )	+
					  '&Address_ID='					+ encodeURIComponent( data.addr_id )	+
					  '&Ship_ID='						+ encodeURIComponent( data.ship_id )	+
					  '&Ship_Data='						+ encodeURIComponent( data.ship_data )	+
					  '&Quantity='						+ encodeURIComponent( data.quantity )	+
					  '&NextDate='						+ encodeURIComponent( data.nextdate )	+
					  '&Template_Codes='				+ EncodeArray( data.template_codes )	+
					  '&Attribute_Codes='				+ EncodeArray( data.attr_codes )		+
					  '&Values='						+ EncodeArray( data.values ) );
}

function OrderItem_Update( order_id, line_id,
						   code, name, 
						   quantity, weight, taxable, price,
						   attributes, options, weights, prices,
						   callback )												{ return AJAX_Call( callback, 'admin', 'OrderItem_Update',						'Order_ID=' + encodeURIComponent( order_id ) + '&Line_ID=' + encodeURIComponent( line_id ) +
																																									'&Code=' + encodeURIComponent( code ) + '&Name=' + encodeURIComponent( name ) +
																																									'&Quantity=' + encodeURIComponent( quantity ) + '&Weight=' + encodeURIComponent( weight ) + '&Price=' + encodeURIComponent( price ) + '&Taxable=' + encodeURIComponent( taxable ) +
																																									'&Attribute_Codes=' + EncodeArray( attributes ) + '&Attribute_Options=' + EncodeArray( options ) + '&Attribute_Weights=' + EncodeArray( weights ) + '&Attribute_Prices=' + EncodeArray( prices ) ); }

function v97_OrderItem_Update( order_id, line_id, data, callback )
{
	return AJAX_Call( callback, 'admin', 'OrderItem_Update',
					  'Order_ID='				+ encodeURIComponent( order_id )		+
					  '&Line_ID='				+ encodeURIComponent( line_id )			+
					  '&Code='					+ encodeURIComponent( data.code )		+
					  '&Name='					+ encodeURIComponent( data.name )		+
					  '&SKU='					+ encodeURIComponent( data.sku )		+
					  '&Quantity='				+ encodeURIComponent( data.quantity )	+
					  '&Weight='				+ encodeURIComponent( data.weight )		+
					  '&Price='					+ encodeURIComponent( data.price )		+
					  '&Taxable='				+ encodeURIComponent( data.taxable )	+
					  '&Attribute_Codes='		+ EncodeArray( data.attributes )		+
					  '&Attribute_Options='		+ EncodeArray( data.options )			+
					  '&Attribute_Weights='		+ EncodeArray( data.weights )			+
					  '&Attribute_Prices='		+ EncodeArray( data.prices ) );
}

function v10_OrderItem_Update( order_id, line_id, data, callback, delegator )
{	
	return AJAX_Call_JSON( callback, 'admin', 'OrderItem_Update',
	{
		Order_ID: 	order_id,
		Line_ID:	line_id,
		Code:		data.code,
		Name:		data.name,
		SKU:		data.sku,
		Quantity:	data.quantity,
		Price:		data.price,
		Weight:		data.weight,
		Taxable:	data.taxable,
		Attributes:	data.attributes
	}, delegator );
}

function Product_Load_Code( product_code, callback )								{ return AJAX_Call( callback, 'admin', 'Product_Load_Code',						'Product_Code=' + encodeURIComponent( product_code ) ); }
function Customer_Product_Load_Code( customer_id, product_code, callback )			{ return AJAX_Call( callback, 'admin', 'Product_Load_Code',						'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_Code=' + encodeURIComponent( product_code ) ); }
function Customer_Product_Load_SKU( customer_id, product_sku, callback )			{ return AJAX_Call( callback, 'admin', 'ProductList_Load_SKU',					'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_SKU=' + encodeURIComponent( product_sku ) ); }
function Product_Load_ID( product_id, callback, delegator )							{ return AJAX_Call( callback, 'admin', 'Product_Load_ID',						'Product_ID=' + encodeURIComponent( product_id ), delegator ); }
function Customer_Product_Load_ID( customer_id, product_id, callback )				{ return AJAX_Call( callback, 'admin', 'Product_Load_ID',						'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_ID=' + encodeURIComponent( product_id ) ); }
function ProductList_Load_CodeMatch_Initialize( http_request,
												customer_id, product_code, count,
												callback )							{ AJAX_AutoComplete_Initialize( http_request, callback, 'admin', 'ProductList_Load_CodeMatch',
																													'Customer_ID=' + encodeURIComponent( customer_id ) +
																													'&Product_Code=' + encodeURIComponent( product_code ) +
																													'&Count=' + encodeURIComponent( count ) ); }
function ProductList_Load_CodeMatch( customer_id, product_code, count,
									 callback, delegator )							{ return AJAX_Call( callback, 'admin', 'ProductList_Load_CodeMatch',			'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_Code=' + encodeURIComponent( product_code ) + '&Count=' + encodeURIComponent( count ), delegator ); }
function ProductList_Load_SKUMatch_Initialize( http_request,
											   customer_id, product_sku, count,
											   callback )							{ AJAX_AutoComplete_Initialize( http_request, callback, 'admin', 'ProductList_Load_CodeMatch',
																													'Customer_ID='	+ encodeURIComponent( customer_id ) +
																													'&Product_SKU='	+ encodeURIComponent( product_sku ) +
																													'&Count='		+ encodeURIComponent( count ) ); }

function ProductList_Load_SKUMatch( customer_id, product_sku, count, callback, delegator )
{ 
	return AJAX_Call_JSON( callback, 'admin', 'ProductList_Load_SKUMatch',
	{
		Customer_ID:	!customer_id ? undefined : customer_id, 
		Product_SKU:	product_sku, 
		Count:			count 
	}, delegator ); 
}

function ProductList_Adjust_Inventory( product_ids, adjustments, callback )			{ return AJAX_Call( callback, 'admin', 'ProductList_Adjust_Inventory',			'Product_IDs=' + EncodeArray( product_ids ) + '&Adjustments=' + EncodeArray( adjustments ) ); }
function ProductList_Update_SKU( product_ids, skus, callback )						{ return AJAX_Call( callback, 'admin', 'ProductList_Update_SKU',				'Product_IDs=' + EncodeArray( product_ids ) + '&SKUs=' + EncodeArray( skus ) ); }
function Attribute_Load_Code( product_code, attribute_code, callback )				{ return AJAX_Call( callback, 'admin', 'Attribute_Load_Code',					'Product_Code=' + encodeURIComponent( product_code ) + '&Attribute_Code=' + encodeURIComponent( attribute_code ) ); }
function Customer_Attribute_Load_Code( customer_id, product_code, attribute_code,
									   callback )									{ return AJAX_Call( callback, 'admin', 'Attribute_Load_Code',					'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_Code=' + encodeURIComponent( product_code ) + '&Attribute_Code=' + encodeURIComponent( attribute_code ) ); }
function AttributeList_Load_Inventory( product_id, callback )						{ return AJAX_Call( callback, 'admin', 'AttributeList_Load_Inventory',			'Product_ID=' + encodeURIComponent( product_id ) ); }

function AttributeList_Load_CodeMatch( customer_id, product_code, attr_code, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'AttributeList_Load_CodeMatch',
	{
		Customer_ID:	!customer_id ? undefined : customer_id,
		Product_Code:	product_code,
		Attribute_Code:	attr_code,
		Count:			count
	}, delegator );
}

function AttributeList_Load_CodeMatch_Initialize( http_request,
												  customer_id, product_code,
												  attr_code, count,
												  callback )						{ AJAX_AutoComplete_Initialize( http_request, callback, 'admin', 'AttributeList_Load_CodeMatch',
																													'Customer_ID=' + encodeURIComponent( customer_id ) +
																													'&Product_Code=' + encodeURIComponent( product_code ) +
																													'&Attribute_Code=' + encodeURIComponent( attr_code ) +
																													'&Count=' + encodeURIComponent( count ) ); }
function Option_Load_Code( product_code, attribute_code, option_code, callback )	{ return AJAX_Call( callback, 'admin', 'Option_Load_Code',						'Product_Code=' + encodeURIComponent( product_code ) + '&Attribute_Code=' + encodeURIComponent( attribute_code ) + '&Option_Code=' + encodeURIComponent( option_code ) ); }

function OptionList_Load_CodeMatch( customer_id, product_code, attr_code, option_code, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'OptionList_Load_CodeMatch',
	{
		Customer_ID:	!customer_id ? undefined : customer_id,
		Product_Code:	product_code,
		Attribute_Code:	attr_code,
		Option_Code:	option_code,
		Count:			count
	}, delegator );
}

function OptionList_Load_CodeMatch_Initialize( http_request,
											   customer_id, product_code,
											   attr_code, option_code, count,
											   callback )							{ AJAX_AutoComplete_Initialize( http_request, callback, 'admin', 'OptionList_Load_CodeMatch',
																													'Customer_ID=' + encodeURIComponent( customer_id ) +
																													'&Product_Code=' + encodeURIComponent( product_code ) +
																													'&Attribute_Code=' + encodeURIComponent( attr_code ) +
																													'&Option_Code=' + encodeURIComponent( option_code ) +
																													'&Count=' + encodeURIComponent( count ) ); }
function Customer_Option_Load_Code( customer_id, product_code,
									attribute_code, option_code, callback )			{ return AJAX_Call( callback, 'admin', 'Option_Load_Code',						'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_Code=' + encodeURIComponent( product_code ) + '&Attribute_Code=' + encodeURIComponent( attribute_code ) + '&Option_Code=' + encodeURIComponent( option_code ) ); }
function OptionList_Load_Attribute( product_id, attribute_id, callback )			{ return AJAX_Call( callback, 'admin', 'OptionList_Load_Attribute',				'Product_ID=' + encodeURIComponent( product_id ) + '&Attribute_ID=' + encodeURIComponent( attribute_id ) ); }
function Customer_OptionList_Load_Attribute( customer_id, product_id,
											 attribute_id, callback )				{ return AJAX_Call( callback, 'admin', 'OptionList_Load_Attribute',				'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_ID=' + encodeURIComponent( product_id ) + '&Attribute_ID=' + encodeURIComponent( attribute_id ) ); }
function AttributeTemplateOptionList_Load_Attribute( attemp_id, attmpat_id,
													 callback )						{ return AJAX_Call( callback, 'admin', 'AttributeTemplateOptionList_Load_Attribute',
																																									'AttributeTemplate_ID=' + encodeURIComponent( attemp_id ) + '&AttributeTemplateAttribute_ID=' + encodeURIComponent( attmpat_id ) ); }
function AttributeAndOptionList_Load_Product( product_id, callback )				{ return AJAX_Call( callback, 'admin', 'AttributeAndOptionList_Load_Product',
																																									'Product_ID=' + encodeURIComponent( product_id ) ); }
function Customer_AttributeAndOptionList_Load_Product( customer_id, product_id,
													   callback, delegator )		{ return AJAX_Call( callback, 'admin', 'AttributeAndOptionList_Load_Product',
																																									'Customer_ID=' + encodeURIComponent( customer_id ) + '&Product_ID=' + encodeURIComponent( product_id ), delegator ); }
function ShippingMethodList_Load_Order( order_id, callback )						{ return AJAX_Call( callback, 'admin', 'ShippingMethodList_Load_Order',			'Order_ID=' + encodeURIComponent( order_id ) ); }

function ShippingLabelMethodList_Load( shipment_id, callback )						{ return AJAX_Call( callback, 'admin', 'ShippingLabelMethodList_Load',			'Shipment_ID=' + encodeURIComponent( shipment_id ) ); }
function ShippingLabelModuleBoxList_Load( module_id, module_data, shipment_id,
										  callback )								{ return AJAX_Call( callback, 'admin', 'ShippingLabelModuleBoxList_Load',		'Module_ID=' + encodeURIComponent( module_id ) + '&Module_Data=' + encodeURIComponent( module_data ) + '&Shipment_ID=' + encodeURIComponent( shipment_id ) ); }
function ShippingLabelShipmentFieldList_Load( module_id, module_data,
											  shipment_id, callback )				{ return AJAX_Call( callback, 'admin', 'ShippingLabelShipmentFieldList_Load',	'Module_ID=' + encodeURIComponent( module_id ) + '&Module_Data=' + encodeURIComponent( module_data ) + '&Shipment_ID=' + encodeURIComponent( shipment_id ) ); }
function ShippingLabelPackageFieldList_Load( module_id, module_data, shipment_id,
											 field_prefix, fields, product_ids,
											 callback )								{ return AJAX_Call_FieldList( callback, 'admin', 'ShippingLabelPackageFieldList_Load',
																																									'Module_ID=' + encodeURIComponent( module_id ) + '&Module_Data=' + encodeURIComponent( module_data ) + '&Shipment_ID=' + encodeURIComponent( shipment_id ) +
																																									'&Field_Prefix=' + encodeURIComponent( field_prefix ) + '&Product_IDs=' + EncodeArray( product_ids ),
																																									fields ); }

function StateList_Load( callback )													{ return AJAX_Call( callback, 'admin', 'StateList_Load',						'' ); }
function CountryList_Load( callback )												{ return AJAX_Call( callback, 'admin', 'CountryList_Load',						'' ); }

function Customer_Load_ID( cust_id, callback )										{ return AJAX_Call( callback, 'admin', 'Customer_Load_ID',						'Customer_ID=' + encodeURIComponent( cust_id ) ); }
function Customer_Load_Login( login, callback )										{ return AJAX_Call( callback, 'admin', 'Customer_Load_Login',					'Customer_Login=' + encodeURIComponent( login ) ); }
function CustomerLoginList_Load_Match( search, count, callback, delegator )			{ return AJAX_Call( callback, 'admin', 'CustomerLoginList_Load_Match',			'Search=' + encodeURIComponent( search ) + '&Count=' + encodeURIComponent( count ), delegator ); }
function CustomerLoginList_Load_Match_Initialize( http_request,
												  search, count,
												  callback )						{ AJAX_AutoComplete_Initialize( http_request, callback, 'admin',
																													'CustomerLoginList_Load_Match',
																													'Search=' + encodeURIComponent( search ) +
																													'&Count=' + encodeURIComponent( count ) ); }

function Store_Load( callback, delegator )											{ return AJAX_Call( callback, 'admin', 'Store_Load',							'', delegator ); }

function TrackingLinkList_Load( callback )											{ return AJAX_Call( callback, 'admin', 'TrackingLinkList_Load',					'' ); }

function ProductKitList_Load_Query( product_id, filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'ProductKitList_Load_Query',				'Product_ID=' + encodeURIComponent( product_id ) + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }
function PartList_Load_ProductKit( product_id, attr_id, attmpat_id, option_id,
								   callback )										{ return AJAX_Call( callback, 'admin', 'PartList_Load_ProductKit',				'Product_ID=' + encodeURIComponent( product_id ) + '&Attribute_ID=' + encodeURIComponent( attr_id ) + '&AttributeTemplateAttribute_ID=' + encodeURIComponent( attmpat_id ) + '&Option_ID=' + encodeURIComponent( option_id ) ); }
function ProductKit_Update_Parts( product_id, attr_id, attmpat_id, option_id,
								  part_ids, quantities,							  
								  callback )										{ return AJAX_Call( callback, 'admin', 'ProductKit_Update_Parts',				'Product_ID=' + encodeURIComponent( product_id ) + '&Attribute_ID=' + encodeURIComponent( attr_id ) + '&AttributeTemplateAttribute_ID=' + encodeURIComponent( attmpat_id ) + '&Option_ID=' + encodeURIComponent( option_id ) +
																																									'&Part_IDs=' + EncodeArray( part_ids ) + '&Quantities=' + EncodeArray( quantities ) ); }
function ProductKit_Variant_Count( product_id, callback )							{ return AJAX_Call( callback, 'admin', 'ProductKit_Variant_Count',				'Product_ID=' + encodeURIComponent( product_id ) ); }
function ProductKit_Generate_Variants( product_id, pricing_method, callback )		{ return AJAX_Call( callback, 'admin', 'ProductKit_Generate_Variants',			'Product_ID=' + encodeURIComponent( product_id ) + '&Pricing_Method=' + encodeURIComponent( pricing_method ) ); }

function ProductInventoryList_Load_ProductKit( product_id, callback )				{ return AJAX_Call( callback, 'admin', 'ProductInventoryList_Load_ProductKit',
																																									'Product_ID=' + encodeURIComponent( product_id ) ); }
function ProductVariantList_Load_Product( product_id,
										  limit_attr_ids, limit_attmpat_ids, limit_option_ids,
										  exclude_attr_ids, exclude_attmpat_ids,
										  include_default_variant,
										  callback )								{ return AJAX_Call( callback, 'admin', 'ProductVariantList_Load_Product',		'Product_ID=' + encodeURIComponent( product_id ) +
																																									'&Limit_Attribute_IDs=' + EncodeArray( limit_attr_ids ) + 
																																									'&Limit_AttributeTemplateAttribute_IDs=' + EncodeArray( limit_attmpat_ids ) +
																																									'&Limit_Option_IDs=' + EncodeArray( limit_option_ids ) +
																																									'&Exclude_Attribute_IDs=' + EncodeArray( exclude_attr_ids ) + 
																																									'&Exclude_AttributeTemplateAttribute_IDs=' + EncodeArray( exclude_attmpat_ids ) +
																																									'&Include_Default_Variant=' + ( include_default_variant ? '1' : '0' ) ); }

function ProductVariantList_Load_Query( product_id, filter, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductVariantList_Load_Query',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function ProductVariantInventoryIndex_Load_ID( product_id, part_id, filter, sort, callback, delegator )	
{ 
	return AJAX_Call_JSON( callback, 'admin', 'ProductVariantInventoryIndex_Load_ID',
	{
		Product_ID:	product_id,
		Part_ID:	part_id,
		Filter:		filter,
		Sort:		sort
	}, delegator );
}

function ProductVariantInventoryList_Load_Query( product_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductVariantInventoryList_Load_Query',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function ProductKitInventoryIndex_Load_ID( product_id, part_id, filter, sort, callback, delegator )	
{ 
	return AJAX_Call_JSON( callback, 'admin', 'ProductKitInventoryIndex_Load_ID',
	{
		Product_ID:	product_id,
		Part_ID:	part_id,
		Filter:		filter,
		Sort:		sort
	}, delegator );
}

function ProductKitInventoryList_Load_Query( product_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductKitInventoryList_Load_Query',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function ProductVariantPartList_Load_Variant( product_id, variant_id, callback )	{ return AJAX_Call( callback, 'admin', 'ProductVariantPartList_Load_Variant'	,
																																									'Product_ID=' + encodeURIComponent( product_id ) + '&Variant_ID=' + encodeURIComponent( variant_id ) ); }
function ProductVariantList_Delete( product_id, variant_ids, callback, delegator )	{ return AJAX_Call( callback, 'admin', 'ProductVariantList_Delete',				'Product_ID=' + encodeURIComponent( product_id ) + '&ProductVariant_IDs=' + EncodeArray( variant_ids ), delegator ); }
function ProductVariant_Generate_Count( product_id, callback )						{ return AJAX_Call( callback, 'admin', 'ProductVariant_Generate_Count',			'Product_ID=' + encodeURIComponent( product_id ) ); }
function ProductVariant_Generate( product_id, pricing_method, callback )			{ return AJAX_Call( callback, 'admin', 'ProductVariant_Generate',				'Product_ID=' + encodeURIComponent( product_id ) + '&Pricing_Method=' + encodeURIComponent( pricing_method ) ); }
function ProductVariant_Generate_Delimiter( product_id, pricing_method, delimiter,
											callback )								{ return AJAX_Call( callback, 'admin', 'ProductVariant_Generate_Delimiter',		'Product_ID=' + encodeURIComponent( product_id ) + '&Pricing_Method=' + encodeURIComponent( pricing_method ) + '&Delimiter=' + encodeURIComponent( delimiter ) ); }

function ProductVariant_Reprice( product_id, pricing_method, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductVariant_Reprice',
	{
		Product_ID:		product_id,
		Pricing_Method:	pricing_method
	}, delegator );
}

function ProductInventoryList_Load_ProductVariants( product_id,
													limit_attr_ids, limit_attmpat_ids, limit_option_ids,
													exclude_attr_ids, exclude_attmpat_ids,
													include_default_variant,
													callback )						{ return AJAX_Call( callback, 'admin', 'ProductInventoryList_Load_ProductVariants',
																																									'Product_ID=' + encodeURIComponent( product_id ) +
																																									'&Limit_Attribute_IDs=' + EncodeArray( limit_attr_ids ) + 
																																									'&Limit_AttributeTemplateAttribute_IDs=' + EncodeArray( limit_attmpat_ids ) +
																																									'&Limit_Option_IDs=' + EncodeArray( limit_option_ids ) +
																																									'&Exclude_Attribute_IDs=' + EncodeArray( exclude_attr_ids ) + 
																																									'&Exclude_AttributeTemplateAttribute_IDs=' + EncodeArray( exclude_attmpat_ids ) +
																																									'&Include_Default_Variant=' + ( include_default_variant ? '1' : '0' ) ); }

function ProductInventoryList_Load_ProductVariants_Filter( product_id, filter, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'ProductInventoryList_Load_ProductVariants_Filter',
					  'Product_ID='	+ encodeURIComponent( product_id )	+
					  '&Filter='	+ EncodeArray( filter ),
					  delegator );
}

function ProductVariant_Insert( product_id, data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductVariant_Insert',
	{
		Product_ID: product_id,
		Attributes:	data.attributes,
		Parts:		data.parts,
		Pricing:	data.pricing
	}, delegator );
}

function ProductVariant_Update( product_id, variant_id, data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductVariant_Update',
	{
		Product_ID: product_id,
		Variant_ID: variant_id,
		Attributes:	data.attributes,
		Parts:		data.parts,
		Pricing:	data.pricing
	}, delegator );
}

function ProductVariantPricing_Load( product_id, variant_id, callback )				{ return AJAX_Call( callback, 'admin', 'ProductVariantPricing_Load',			'Product_ID=' + encodeURIComponent( product_id ) + '&Variant_ID=' + encodeURIComponent( variant_id ) ); }
function ProductVariantPricing_Update( product_id, variant_id,
									   method, price, cost, weight,
									   callback )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductVariantPricing_Update',
	{
		Product_ID:	product_id,
		Variant_ID:	variant_id,
		Method:		method,
		Price:		price,
		Cost:		cost,
		Weight:		weight
	} );
}

function ProductImageIndex_Load_ID( product_id, productimage_id, filter, sort, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'ProductImageIndex_Load_ID',				'Product_ID=' + encodeURIComponent( product_id ) + '&ProductImage_ID=' + encodeURIComponent( productimage_id ) + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ), delegator ); }
function ProductImageList_Load_Product( product_id, callback )						{ return AJAX_Call( callback, 'admin', 'ProductImageList_Load_Product',			'Product_ID=' + encodeURIComponent( product_id ) ); }

function ProductImageList_Load_Query( product_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductImageList_Load_Query',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Sort: 		sort,
		Offset:		offset,
		Count:		count
	}, delegator ); 
}

function ProductImageList_DisplayOrder_Update( product_id, fieldlist, callback )	{ return AJAX_Call_FieldList( callback, 'admin', 'ProductImageList_DisplayOrder_Update',	'Product_ID=' + encodeURIComponent( product_id ), fieldlist ); }
function ProductImage_Delete( id, callback, delegator )								{ return AJAX_Call( callback, 'admin', 'ProductImage_Delete',					'ProductImage_ID=' + encodeURIComponent( id ), delegator ); }

function ProductImageList_Delete( delete_ids, 
									callback )										{ return AJAX_Call( callback, 'admin', 'ProductImageList_Delete',				'ProductImage_IDs=' + EncodeArray( delete_ids ) ); }

function ImageList_Load_Query( filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'ImageList_Load_Query',					'Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }

function ImageListWithGeneratedImages_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'ImageListWithGeneratedImages_Load_Query',
					  'Filter='		+ EncodeArray( filter )			+
					  '&Sort='		+ encodeURIComponent( sort )	+
					  '&Offset='	+ encodeURIComponent( offset )	+
					  '&Count='		+ encodeURIComponent( count ),
					  delegator );
}

function GeneratedImageList_Load_Image( image_id, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'GeneratedImageList_Load_Image',
					  'Image_ID=' + encodeURIComponent( image_id ),
					  delegator );
}

function GeneratedImage_Load_NearestConstrained( image_id, width, height, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'GeneratedImage_Load_NearestConstrained',
	{
		Image_ID:	image_id,
		Width:		width,
		Height:		height
	}, delegator );
}

function Image_Upload( file_input, file_object, progress_object, delegator )		{ return AJAX_Call_WithFile( progress_object, 'admin', 'Image_Upload',			null,
																																									'Image', file_input, file_object, delegator ); }
function Image_Add( filepath, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'Image_Add',								'Filepath=' + encodeURIComponent( filepath ), delegator ); }

function Image_AddGeneratedImage( image_id, width, height, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'Image_AddGeneratedImage',
					  'Image_ID='				+ encodeURIComponent( image_id )	+
					  '&GeneratedImage_Width='	+ encodeURIComponent( width )		+ 
					  '&GeneratedImage_Height='	+ encodeURIComponent( height ),
					  delegator );
}

function Image_Delete( id, image_delete, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Image_Delete',
	{
		Image_ID: 		id,
		Image_Delete:	image_delete
	}, delegator );
}

function ImageType_Load_ID( imagetype_id, callback )								{ return AJAX_Call( callback, 'admin', 'ImageType_Load_ID',						'ImageType_ID=' + encodeURIComponent( imagetype_id ) ); }

function ImageTypeList_Load_All( callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ImageTypeList_Load_All', null, delegator );
}

function ImageTypeList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ImageTypeList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function ImageType_Insert( code, descrip, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'ImageType_Insert',						'ImageType_Code=' + encodeURIComponent( code ) + '&ImageType_Descrip=' + encodeURIComponent( descrip ), delegator ); }
function ImageType_Update( imagetype_id, code, descrip, callback, delegator )		{ return AJAX_Call( callback, 'admin', 'ImageType_Update',						'ImageType_ID=' + encodeURIComponent( imagetype_id ) + '&ImageType_Code=' + encodeURIComponent( code ) + '&ImageType_Descrip=' + encodeURIComponent( descrip ), delegator ); }
function ImageType_Delete( imagetype_id, callback )									{ return AJAX_Call( callback, 'admin', 'ImageType_Delete',						'ImageType_ID=' + encodeURIComponent( imagetype_id ) ); }
function ImageType_Referenced( imagetype_id, callback )								{ return AJAX_Call( callback, 'admin', 'ImageType_Referenced',					'ImageType_ID=' + encodeURIComponent( imagetype_id ) ); }
function ImageTypeList_Update_Offsets(	imagetype_ids, 
										imagetype_startoffsets, 
										imagetype_newoffsets, 
										callback )									{ return AJAX_Call( callback, 'admin', 'ImageTypeList_Update_Offsets',			'ImageType_IDs=' + EncodeArray( imagetype_ids ) +
																																									'&ImageType_StartOffsets=' + EncodeArray( imagetype_startoffsets ) +
																																									'&ImageType_NewOffsets=' + EncodeArray( imagetype_newoffsets ) ); }

function ProductImage_Upload( product_id, imagetype_id, file_input, file_object,
							  progress_object )										{ return AJAX_Call_WithFile( progress_object, 'admin', 'ProductImage_Upload',	{ Product_ID:	product_id,
																																									  ImageType_ID:	imagetype_id },
																																									'Product_Image', file_input, file_object ); }

function ProductImage_Add( filepath, product_id, imagetype_id,
						   callback, delegator )									{ return AJAX_Call( callback, 'admin', 'ProductImage_Add',						'Filepath=' + encodeURIComponent( filepath ) +
																																									'&Product_ID=' + encodeURIComponent( product_id ) +
																																									'&ImageType_ID=' + encodeURIComponent( imagetype_id ), delegator ); }

function Image_Assign_OptionParts( product_id, attr_id, attmpat_id, opt_id,
								   image_id, imagetype_id,
								   callback, delegator )							{ return AJAX_Call( callback, 'admin', 'Image_Assign_OptionParts',				'Product_ID='						+ encodeURIComponent( product_id )	+
																																									'&Attribute_ID='					+ encodeURIComponent( attr_id )		+
																																									'&AttributeTemplateAttribute_ID='	+ encodeURIComponent( attmpat_id )	+ 
																																									'&Option_ID='						+ encodeURIComponent( opt_id )		+
																																									'&Image_ID='						+ encodeURIComponent( image_id )	+
																																									'&ImageType_ID='					+ encodeURIComponent( imagetype_id ), delegator ); }

function ProductImage_Update_Type(	productimage_id, imagetype_id,
									callback )										{ return AJAX_Call( callback, 'admin', 'ProductImage_Update_Type',				'ProductImage_ID=' + encodeURIComponent( productimage_id ) +
																																									'&ImageType_ID=' + encodeURIComponent( imagetype_id ) ); }

function ModuleList_Load_Features( features, callback )								{ return AJAX_Call( callback, 'admin', 'ModuleList_Load_Features',				'Module_Features=' + encodeURIComponent( features ) ); }
function StoreModuleList_Load_Feature( feature, callback )							{ return AJAX_Call( callback, 'admin', 'StoreModuleList_Load_Feature',			'Module_Feature=' + encodeURIComponent( feature ) ); }
function CustomerCustomFieldList_Load( callback, delegator )						{ return AJAX_Call( callback, 'admin', 'CustomerCustomFieldList_Load',			'', delegator ); }

function CustomerList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CustomerList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function CustomerIndex_Load_ID( customer_id, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CustomerIndex_Load_ID',
	{
		Customer_ID:	customer_id,
		Filter:			filter,
		Sort:			sort
	}, delegator );
}

function Customer_Delete( id, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'Customer_Delete',						'Customer_ID=' + encodeURIComponent( id ), delegator ); }
function CustomerList_Delete( customer_ids, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'CustomerList_Delete',					'Customer_IDs=' + EncodeArray( customer_ids ), delegator ); }
function Customer_Update( id, fieldlist, callback, delegator )						{ return AJAX_Call_FieldList( callback, 'admin', 'Customer_Update',				'Customer_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function Customer_Insert( fieldlist, callback, delegator )							{ return AJAX_Call_FieldList( callback, 'admin', 'Customer_Insert',				'', fieldlist, delegator ); }

function v10_Customer_Insert( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Customer_Insert',
	{
		Customer_Login:				data.login,
		Customer_PasswordEmail:		data.pw_email,
		Customer_Password:			data.password,
		Customer_ShipResidential:	data.ship_res,
		Customer_ShipFirstName:		data.ship_fname,
		Customer_ShipLastName:		data.ship_lname,
		Customer_ShipEmail:			data.ship_email,
		Customer_ShipCompany:		data.ship_comp,
		Customer_ShipPhone:			data.ship_phone,
		Customer_ShipFax:			data.ship_fax,
		Customer_ShipAddress1:		data.ship_addr,
		Customer_ShipAddress2:		data.ship_addr2,
		Customer_ShipCity:			data.ship_city,
		Customer_ShipState:			data.ship_state,
		Customer_ShipZip:			data.ship_zip,
		Customer_ShipCountry:		data.ship_cntry,
		Customer_BillFirstName:		data.bill_fname,
		Customer_BillLastName:		data.bill_lname,
		Customer_BillEmail:			data.bill_email,
		Customer_BillCompany:		data.bill_comp,
		Customer_BillPhone:			data.bill_phone,
		Customer_BillFax:			data.bill_fax,
		Customer_BillAddress1:		data.bill_addr,
		Customer_BillAddress2:		data.bill_addr2,
		Customer_BillCity:			data.bill_city,
		Customer_BillState:			data.bill_state,
		Customer_BillZip:			data.bill_zip,
		Customer_BillCountry:		data.bill_cntry,
		Customer_Tax_Exempt:		data.tax_exempt,
		Customer_BusinessAccount:	data.business_title
	}, delegator );
}

function CustomerCreditHistoryList_Load_Query( customer_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CustomerCreditHistoryList_Load_Query',
	{
		Customer_ID:	customer_id,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function CustomerCreditHistory_Insert( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CustomerCreditHistory_Insert',
	{
		Customer_ID:			data.customer_id,
		Amount:					data.amount,
		Description:			data.descrip,
		TransactionReference:	data.txref
	}, delegator );
}

function CustomerCreditHistory_Delete( id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CustomerCreditHistory_Delete',
	{
		CustomerCreditHistory_ID: id
	}, delegator );
}

function StandardFields_Load( callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'StandardFields_Load', '', delegator );
}

function ProductCustomFieldList_Load( callback, delegator )							{ return AJAX_Call( callback, 'admin', 'ProductCustomFieldList_Load',			'', delegator ); }

function ProductCustomFieldList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductCustomFieldList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function ProductIndex_Load_ID( product_id, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductIndex_Load_ID',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Sort:		sort
	}, delegator );
}

function ProductList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function Product_Delete( id, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'Product_Delete',						'Product_ID=' + encodeURIComponent( id ), delegator ); }
function ProductList_Delete( product_ids, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'ProductList_Delete',					'Product_IDs=' + EncodeArray( product_ids ), delegator ); }
function Product_Update( id, fieldlist, callback, delegator )						{ return AJAX_Call_FieldList( callback, 'admin', 'Product_Update',				'Product_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function ProductList_DisplayOrder_Update( fieldlist, callback )						{ return AJAX_Call_FieldList( callback, 'admin', 'ProductList_DisplayOrder_Update',	'', fieldlist ); }
function ProductList_BatchSort( sort_by, callback )									{ return AJAX_Call( callback, 'admin', 'ProductList_BatchSort',					'Product_Sort_By=' + encodeURIComponent( sort_by ) ); }

function UserPreferenceList_Load_Query( user_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'UserPreferenceList_Load_Query',
	{
		User_ID:	user_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function UserPreference_Insert( user_id, fieldlist, callback, delegator )			{ return AJAX_Call_FieldList( callback, 'admin', 'UserPreference_Insert',								'UserPreference_UserID=' + encodeURIComponent( user_id ), fieldlist, delegator ); }
function UserPreference_Update( user_id, fieldlist, callback, delegator )			{ return AJAX_Call_FieldList( callback, 'admin', 'UserPreference_Update',								'UserPreference_UserID=' + encodeURIComponent( user_id ), fieldlist, delegator ); }
function UserPreference_Delete( store_id, user_id, key, callback, delegator )		{ return AJAX_Call( callback, 'admin', 'UserPreference_Delete',											'UserPreference_StoreID=' + encodeURIComponent( store_id ) + '&UserPreference_UserID=' + encodeURIComponent( user_id ) + '&UserPreference_Key=' + encodeURIComponent( key ), delegator ); }

function UserPreferenceList_Load_Heirarchy( key_prefix, callback, delegator )		{ return AJAX_Call( callback, 'admin', 'UserPreferenceList_Load_Heirarchy',						'UserPreference_Key_Prefix=' + encodeURIComponent( key_prefix ), delegator ); }
function UserPreferenceList_Load_Domain_Heirarchy( key_prefix, callback, delegator ){ return AJAX_Call_WithStoreCode( callback, 'admin', '', 'UserPreferenceList_Load_Heirarchy',	'UserPreference_Key_Prefix=' + encodeURIComponent( key_prefix ), delegator ); }

function UserPreference_Delete_CurrentUser_Key( store_code, key, callback, delegator )
{
	MMCachedPreferenceList_Delete_Key( key );

	if ( typeof store_code === 'string' && store_code.length )
	{
		return AJAX_Call_WithStoreCode( callback, 'admin', store_code, 'UserPreference_Delete_CurrentUser_Key',
										'UserPreference_Key=' + encodeURIComponent( key ),
										delegator );
	}

	return AJAX_Call_Domain( callback, 'admin', 'UserPreference_Delete_CurrentUser_Key',
							 'UserPreference_Key=' + encodeURIComponent( key ),
							 delegator );
}

function UserPreferenceList_Save( store_code, key_array, value_array, callback, delegator )
{
	MMCachedPreferenceList_Update( key_array, value_array );

	if ( typeof store_code === 'string' && store_code.length )
	{
		return AJAX_Call_WithStoreCode( callback, 'admin', store_code, 'UserPreferenceList_Save',
										'UserPreference_Keys='		+ EncodeArray( key_array ) +
										'&UserPreference_Values='	+ EncodeArray( value_array ),
										delegator );
	}

	return AJAX_Call_Domain( callback, 'admin', 'UserPreferenceList_Save',
							 'UserPreference_Keys='		+ EncodeArray( key_array ) +
							 '&UserPreference_Values='	+ EncodeArray( value_array ),
							 delegator );
}

function MMTextEditor_FontSizeList_Load_All( callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'MMTextEditor_FontSizeList_Load_All', '', delegator );
}

function MMScreen_Load_MMScreenContext( callback, delegator )
{
	return AJAX_Call( callback,
					  'admin',
					  'MMScreen_Load_MMScreenContext',
					  '',
					  delegator );
}

function ProductAttributeAndOptionList_Load_Query( product_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductAttributeAndOptionList_Load_Query',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator ); }

function Attribute_Insert( product_id, fieldlist, callback, delegator )
{
	return AJAX_Call_JSON_FieldList( callback, 'admin', 'Attribute_Insert',
	{
		Product_ID: product_id
	}, fieldlist, delegator );
}

function Attribute_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_JSON_FieldList( callback, 'admin', 'Attribute_Update',
	{
		Attribute_ID: id
	}, fieldlist, delegator );
}

function Attribute_Delete( id, callback, delegator )								{ return AJAX_Call( callback, 'admin', 'Attribute_Delete',												'Attribute_ID=' + encodeURIComponent( id ), delegator ); }

function Attribute_CopyTemplate( product_id, template_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Attribute_CopyTemplate',
	{
		Product_ID:				product_id,
		AttributeTemplate_ID:	template_id
	}, delegator );
}

function Attribute_CopyLinkedTemplate( id, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'Attribute_CopyLinkedTemplate',									'Attribute_ID=' + encodeURIComponent( id ), delegator ); }
function Option_Insert( product_id, attr_id, fieldlist, callback, delegator )		{ return AJAX_Call_FieldList( callback, 'admin', 'Option_Insert',										'Product_ID=' + encodeURIComponent( product_id ) + '&Attribute_ID=' + encodeURIComponent( attr_id ), fieldlist, delegator ); }
function Option_Update( id, fieldlist, callback, delegator )						{ return AJAX_Call_FieldList( callback, 'admin', 'Option_Update',										'Option_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function Option_Set_Default( id, is_default, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'Option_Set_Default',											'Option_ID=' + encodeURIComponent( id ) + '&Option_Default=' + ( is_default ? 1 : 0 ), delegator ); }
function Option_Delete( id, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'Option_Delete',													'Option_ID=' + encodeURIComponent( id ), delegator ); }

function AttributeList_DisplayOrder_Update( product_id, fieldlist, callback )		{ return AJAX_Call_FieldList( callback, 'admin', 'AttributeList_DisplayOrder_Update',					'Product_ID=' + encodeURIComponent( product_id ), fieldlist ); }
		
function AttributeTemplateAttributeList_Load_Query( template_id, filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'AttributeTemplateAttributeList_Load_Query',						'AttributeTemplate_ID=' + encodeURIComponent( template_id ) + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }
function AttributeTemplateAttributeList_DisplayOrder_Update( template_id, fieldlist, callback )
																					{ return AJAX_Call_FieldList( callback, 'admin', 'AttributeTemplateAttributeList_DisplayOrder_Update',	'AttributeTemplate_ID=' + encodeURIComponent( template_id ), fieldlist ); }
function AttributeTemplateAttribute_Insert( template_id, fieldlist, callback, delegator )
																					{ return AJAX_Call_FieldList( callback, 'admin', 'AttributeTemplateAttribute_Insert',					'AttributeTemplate_ID=' + encodeURIComponent( template_id ), fieldlist, delegator ); }
function AttributeTemplateAttribute_Update( id, fieldlist, callback, delegator )	{ return AJAX_Call_FieldList( callback, 'admin', 'AttributeTemplateAttribute_Update',					'AttributeTemplateAttribute_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function AttributeTemplateAttribute_Delete( id, callback, delegator )				{ return AJAX_Call( callback, 'admin', 'AttributeTemplateAttribute_Delete',								'AttributeTemplateAttribute_ID=' + encodeURIComponent( id ), delegator ); }
function AttributeTemplateOption_Insert( template_id, attmpat_id, fieldlist, callback, delegator )
																					{ return AJAX_Call_FieldList( callback, 'admin', 'AttributeTemplateOption_Insert',						'AttributeTemplate_ID=' + encodeURIComponent( template_id ) + '&AttributeTemplateAttribute_ID=' + encodeURIComponent( attmpat_id ), fieldlist, delegator ); }
function AttributeTemplateOption_Update( id, fieldlist, callback, delegator )		{ return AJAX_Call_FieldList( callback, 'admin', 'AttributeTemplateOption_Update',						'AttributeTemplateOption_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function AttributeTemplateOption_Set_Default( id, is_default, callback, delegator )	{ return AJAX_Call( callback, 'admin', 'AttributeTemplateOption_Set_Default',							'AttributeTemplateOption_ID=' + encodeURIComponent( id ) + '&AttributeTemplateOption_Default=' + ( is_default ? 1 : 0 ), delegator ); }
function AttributeTemplateOption_Delete( id, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'AttributeTemplateOption_Delete',								'AttributeTemplateOption_ID=' + encodeURIComponent( id ), delegator ); }

function AdministrativeSessionList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'AdministrativeSessionList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function AdministrativeSession_Delete( token, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'AdministrativeSession_Delete',									'Delete_Token=' + encodeURIComponent( token ), delegator ); }

function ShipmentTrackingLinkList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'ShipmentTrackingLinkList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function ShipmentTrackingLink_Insert( fieldlist, callback, delegator )				{ return AJAX_Call_FieldList( callback, 'admin', 'ShipmentTrackingLink_Insert',							'', fieldlist, delegator ); }
function ShipmentTrackingLink_Update( fieldlist, callback, delegator )				{ return AJAX_Call_FieldList( callback, 'admin', 'ShipmentTrackingLink_Update',							'', fieldlist, delegator ); }
function ShipmentTrackingLink_Delete( type, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'ShipmentTrackingLink_Delete',									'TrackingLink_Type=' + encodeURIComponent( type ), delegator ); }
function DomainCountryList_Load_Query( filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'DomainCountryList_Load_Query',									'Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }
function DomainCountry_Insert( fieldlist, callback, delegator )						{ return AJAX_Call_FieldList( callback, 'admin', 'DomainCountry_Insert',								'', fieldlist, delegator ); }
function DomainCountry_Update( id, fieldlist, callback, delegator )					{ return AJAX_Call_FieldList( callback, 'admin', 'DomainCountry_Update',								'Country_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function DomainCountry_Delete( id, callback, delegator )							{ return AJAX_Call( callback, 'admin', 'DomainCountry_Delete',											'Country_ID=' + encodeURIComponent( id ), delegator ); }

function PrintQueueList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'PrintQueueList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function PrintQueue_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Domain_FieldList( callback, 'admin', 'PrintQueue_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function PrintQueue_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Domain_FieldList( callback, 'admin', 'PrintQueue_Update',
									   'PrintQueue_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}

function PrintQueue_Delete( id, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'PrintQueue_Delete',
	{
		PrintQueue_ID: id
	}, delegator );
}

function PrintQueueJobList_Load_Query( printqueue_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'PrintQueueJobList_Load_Query',
	{
		PrintQueue_ID:	printqueue_id,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function PrintQueueJob_Insert( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'PrintQueueJob_Insert',
	{
		PrintQueue_ID:				data.printqueue_id,
		PrintQueueJob_Description:	data.descrip,
		PrintQueueJob_Format:		data.format,
		PrintQueueJob_Data:			data.data
	}, delegator );
}

function PrintQueueJob_Delete( id, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'PrintQueueJob_Delete',
	{
		PrintQueueJob_ID: id
	}, delegator );
}

function PrintQueueJob_Status( id, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'PrintQueueJob_Status',
	{
		PrintQueueJob_ID: id
	}, delegator );
}

function ModuleList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'ModuleList_Load_Query',
	{
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function GroupList_Load_All( callback, delegator )
{
	return AJAX_Call_Domain( callback,
							 'admin',
							 'GroupList_Load_All',
							 '',
							 delegator );
}

function GroupList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'GroupList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function UserGroupList_Load_Query( user_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'UserGroupList_Load_Query',
	{
		User_ID:	user_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count,
		Assigned:	assigned,
		Unassigned:	unassigned
	}, delegator );
}

function Group_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Domain_FieldList( callback, 'admin', 'Group_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function Group_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Domain_FieldList( callback, 'admin', 'Group_Update',
									   'Group_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}

function Group_Delete( id, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'Group_Delete',
							 'Group_ID=' + encodeURIComponent( id ),
							 delegator );
}

function GroupList_Delete( group_ids, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'GroupList_Delete',
							 'Group_IDs=' + EncodeArray( group_ids ),
							 delegator );
}

function GroupUserList_Load_Query( group_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'GroupUserList_Load_Query',
	{
		Group_ID:	group_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count,
		Assigned:	assigned,
		Unassigned:	unassigned
	}, delegator );
}

function GroupUser_Update_Assigned( group_id, store_id, user_id, assigned, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'GroupUser_Update_Assigned',
							 'Group_ID='	+ encodeURIComponent( group_id )	+
							 '&Store_ID='	+ encodeURIComponent( store_id )	+
							 '&User_ID='	+ encodeURIComponent( user_id )		+
							 '&Assigned='	+ ( assigned ? '1' : '0' ),
							 delegator );
}

function GroupImportList_Load_Query( group_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'GroupImportList_Load_Query',
							 'Group_ID='	+ encodeURIComponent( group_id )	+
							 '&Filter='		+ EncodeArray( filter )				+
							 '&Sort='		+ encodeURIComponent( sort )		+
							 '&Offset='		+ encodeURIComponent( offset )		+
							 '&Count='		+ encodeURIComponent( count )		+
							 '&Assigned='	+ ( assigned ? '1' : '0' )			+
							 '&Unassigned='	+ ( unassigned ? '1' : '0' ),
							 delegator );
}

function GroupImport_Update_Assigned( group_id, store_code, import_id, assigned, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'GroupImport_Update_Assigned',
							 'Group_ID='	+ encodeURIComponent( group_id )	+
							 '&Store_Code='	+ encodeURIComponent( store_code )	+
							 '&Import_ID='	+ encodeURIComponent( import_id )	+
							 '&Assigned='	+ ( assigned ? '1' : '0' ),
							 delegator );
}

function GroupImportModuleList_Load_Query( group_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'GroupImportModuleList_Load_Query',
	 {
		Group_ID:	group_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count,
		Assigned:	assigned,
		Unassigned:	unassigned
	 }, delegator );
}

function GroupImportModule_Update_Assigned( group_id, store_id, module_id, assigned, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'GroupImportModule_Update_Assigned',
							 'Group_ID='	+ encodeURIComponent( group_id )	+
							 '&Store_ID='	+ encodeURIComponent( store_id )	+
							 '&Module_ID='	+ encodeURIComponent( module_id )	+
							 '&Assigned='	+ ( assigned ? '1' : '0' ),
							 delegator );
}

function GroupExportModuleList_Load_Query( group_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'GroupExportModuleList_Load_Query',
	{
		Group_ID:	group_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count,
		Assigned:	assigned,
		Unassigned:	unassigned
	}, delegator );
}

function GroupExportModule_Update_Assigned( group_id, store_id, module_id, assigned, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'GroupExportModule_Update_Assigned',
							 'Group_ID='	+ encodeURIComponent( group_id )	+
							 '&Store_ID='	+ encodeURIComponent( store_id )	+
							 '&Module_ID='	+ encodeURIComponent( module_id )	+
							 '&Assigned='	+ ( assigned ? '1' : '0' ),
							 delegator );
}

function GroupPrivilegeList_Load_Query( group_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'GroupPrivilegeList_Load_Query',
	{
		Group_ID:	group_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function GroupPrivilege_Update_Privileges( group_id, privilege, view_checked, add_checked, modify_checked, delete_checked, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'GroupPrivilege_Update_Privileges',
					  'Group_ID='							+ encodeURIComponent( group_id )	+
					  '&GroupPrivilege_Privilege='			+ encodeURIComponent( privilege )	+
					  '&GroupPrivilege_ViewPrivilege='		+ ( view_checked ? 1 : 0 )			+
					  '&GroupPrivilege_AddPrivilege='		+ ( add_checked ? 1 : 0 )			+
					  '&GroupPrivilege_ModifyPrivilege='	+ ( modify_checked ? 1 : 0 )		+
					  '&GroupPrivilege_DeletePrivilege='	+ ( delete_checked ? 1 : 0 ),
					  delegator );
}

function UserList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'UserList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function GroupUserList_Load_Query( group_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'GroupUserList_Load_Query',
	{
		Group_ID:	group_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count,
		Assigned:	assigned,
		Unassigned:	unassigned
	}, delegator );
}

function User_Insert( data, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'User_Insert',
	{
		User_Name:					data.username,
		User_Password:				data.password,
		User_Email:					data.email,
		User_CellPhone:				data.cellphone,
		User_IPRange:				data.ip_range,
		User_Icon:					data.icon,
		User_Description:			data.descrip,
		User_ForcePasswordChange:	data.forcepwchg,
		User_ForceTwoFactorChange:	data.forcetfchg,
		User_Administrator:			data.admin,
		User_LicenseType:			data.lictype,
		User_License:				data.license,
		User_Expires:				data.exp_date,
		User_GroupIDs:				data.assigned_group_ids
	}, delegator );
}

function User_Insert_WithIconImage( data, progress_object, delegator )
{
	return AJAX_Call_WithFile( progress_object, 'admin', 'User_Insert_WithIconImage',
	{
		User_Name:					data.username,
		User_Password:				data.password,
		User_Email:					data.email,
		User_CellPhone:				data.cellphone,
		User_Description:			data.descrip,
		User_ForcePasswordChange:	data.forcepwchg,
		User_ForceTwoFactorChange:	data.forcetfchg,
		User_Administrator:			data.admin,
		User_LicenseType:			data.lictype,
		User_License:				data.license,
		User_Expires:				data.exp_date,
		User_GroupIDs:				data.assigned_group_ids
	}, 'User_IconImage', null, data.icon_file, delegator );
}

function User_Update( data, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'User_Update',
	{
		User_ID:					data.id,
		User_Name:					data.username,
		User_Email:					data.email,
		User_CellPhone:				data.cellphone,
		User_IPRange:				data.ip_range,
		User_Icon:					data.icon,
		User_Description:			data.descrip,
		User_Administrator:			data.admin,
		User_ForcePasswordChange:	data.forcepwchg,
		User_ForceTwoFactorChange:	data.forcetfchg,
		User_LicenseType:			data.lictype,
		User_License:				data.license,
		User_Expires:				data.exp_date
	}, delegator );
}

function User_Update_WithIconImage( data, progress_object, delegator )
{
	return AJAX_Call_WithFile( progress_object, 'admin', 'User_Update_WithIconImage',
	{
		User_ID:					data.id,
		User_Name:					data.username,
		User_Email:					data.email,
		User_CellPhone:				data.cellphone,
		User_Description:			data.descrip,
		User_Administrator:			data.admin,
		User_ForcePasswordChange:	data.forcepwchg,
		User_ForceTwoFactorChange:	data.forcetfchg,
		User_LicenseType:			data.lictype,
		User_License:				data.license,
		User_Expires:				data.exp_date
	}, 'User_IconImage', null, data.icon_file, delegator );
}

function User_Update_Password( data, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_Update_Password',
							 'User_ID='						+ encodeURIComponent( data.id )					+
							 '&User_CurrentPassword='		+ encodeURIComponent( data.current_password )	+
							 '&User_Password='				+ encodeURIComponent( data.password )			+
							 '&User_ForcePasswordChange='	+ encodeURIComponent( data.forcepwchg ? '1' : '0' ),
							 delegator );
}

function User_Update_SSHAuthentication( user_id, ssh_pubkey, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'User_Update_SSHAuthentication',
	{
		User_ID:				user_id,
		User_SSHAuthentication:	ssh_pubkey
	}, delegator );
}

function User_Unlock( user_id, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_Unlock',
							 'User_ID=' + encodeURIComponent( user_id ),
							 delegator );
}

function User_ClearFailedLoginAttempts( callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'User_ClearFailedLoginAttempts', null, delegator );
}

function User_Delete( user_id, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_Delete',
							 'User_ID=' + encodeURIComponent( user_id ),
							 delegator );
}

function User_TwoFactor_Disable( user_id, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_TwoFactor_Disable',
							 'User_ID=' + encodeURIComponent( user_id ),
							 delegator );
}

function User_TOTP_Register( user_id, totp_key, totp_code, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_TOTP_Register',
							 'User_ID='		+ encodeURIComponent( user_id ) +
							 '&TOTP_Key='	+ encodeURIComponent( totp_key ) +
							 '&TOTP_Code='	+ encodeURIComponent( totp_code ),
							 delegator );
}

function User_YubiCloud_Register( user_id, otp, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_YubiCloud_Register',
							 'User_ID=' + encodeURIComponent( user_id ) +
							 '&OTP='	+ encodeURIComponent( otp ),
							 delegator );
}

function User_WebAuthn_Register( user_id, id, attestationobject, clientdatajson, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_WebAuthn_Register',
							 'User_ID='				+ encodeURIComponent( user_id )				+
							 '&ID='					+ encodeURIComponent( id )					+
							 '&AttestationObject='	+ encodeURIComponent( attestationobject )	+
							 '&ClientDataJSON='		+ encodeURIComponent( clientdatajson ),
							 delegator );
}

function User_WebAuthn_Challenge_Generate( user_id, callback )
{
	return AJAX_Call_Domain( callback, 'admin', 'User_WebAuthn_Challenge_Generate',
							 'User_ID='				+ encodeURIComponent( user_id ) );
}

function UserSettings_Update( data, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'UserSettings_Update',
	{
		User_ID:							data.id,
		User_PageLen:						data.page_len,
		User_ListLoadCountType:				data.mmbl_count_type,
		User_ListLoadCount:					data.mmbl_count,
		User_ListTrackSearchSortSeparately:	data.mmbl_sort,
		User_ListHover_Active:				data.hover_on,
		User_WordWrap_Description:			data.wwdescrip
	}, delegator );
}

function UserPrivilegeList_Load( store_code, callback, delegator )
{
	if ( typeof store_code === 'string' && store_code.length )
	{
		return AJAX_Call_WithStoreCode( callback, 'admin', store_code, 'UserPrivilegeList_Load', '', delegator );
	}

	return AJAX_Call_Domain( callback, 'admin', 'UserPrivilegeList_Load', '', delegator );
}

function TOTPKey_Generate( callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'TOTPKey_Generate',
							 '',
							 delegator );
}

function StoreCountryList_Load_Query( assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'StoreCountryList_Load_Query',
					  'Filter='			+ EncodeArray( filter )			+
					  '&Sort='			+ encodeURIComponent( sort )	+
					  '&Offset='		+ encodeURIComponent( offset )	+
					  '&Count='			+ encodeURIComponent( count )	+
					  '&Assigned='		+ ( assigned ? '1' : '0' )		+
					  '&Unassigned='	+ ( unassigned ? '1' : '0' ),
					  delegator );
}

function StoreCountryIndex_Load_ID( id, assigned, unassigned, filter, sort, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'StoreCountryIndex_Load_ID',
					  'Country_ID='			+ encodeURIComponent( id )					+ 
					  '&Filter='			+ EncodeArray( filter )						+ 
					  '&Sort='				+ encodeURIComponent( sort )				+ 
					  '&Assigned='			+ ( assigned ? '1' : '0' )					+ 
					  '&Unassigned='		+ ( unassigned ? '1' : '0' ),
					  delegator );
}

function StoreCountry_Update_Assigned( id, assigned, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'StoreCountry_Update_Assigned',
					  'Country_ID='	+ encodeURIComponent( id )	+
					  '&Assigned='	+ ( assigned ? '1' : '0' ),
					  delegator );
}

function StoreCountryList_DisplayOrder_Update( fieldlist, callback )
{
	return AJAX_Call_FieldList( callback, 'admin', 'StoreCountryList_DisplayOrder_Update', '', fieldlist );
}

function EncryptionKeyList_Load_Query( filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'EncryptionKeyList_Load_Query',									'Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }
function EncryptionKey_Delete( prompt, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'EncryptionKey_Delete',											'Encryption_Prompt=' + encodeURIComponent( prompt ), delegator ); }																					

function CategoryCustomFieldList_Load( callback, delegator )						{ return AJAX_Call( callback, 'admin', 'CategoryCustomFieldList_Load',									'', delegator ); }

function CategoryCustomFieldList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryCustomFieldList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function CategoryList_Load_Parent( parent_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryList_Load_Parent',
	{
		Parent_ID: parent_id
	}, delegator );
}

function CategoryIndex_Load_ID( category_id, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryIndex_Load_ID',
	{
		Category_ID:	category_id,
		Filter:			filter,
		Sort:			sort
	}, delegator );
}

function CategoryList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function Category_Delete( id, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'Category_Delete',												'Category_ID=' + encodeURIComponent( id ), delegator ); }
function CategoryList_Delete( category_ids, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'CategoryList_Delete',											'Category_IDs=' + EncodeArray( category_ids ), delegator ); }
function Category_Update( id, fieldlist, callback, delegator )						{ return AJAX_Call_FieldList( callback, 'admin', 'Category_Update',										'Category_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function CategoryList_DisplayOrder_Update( fieldlist, callback )					{ return AJAX_Call_FieldList( callback, 'admin', 'CategoryList_DisplayOrder_Update',					'', fieldlist ); }
function CategoryList_BatchSort( sort_by, callback )								{ return AJAX_Call( callback, 'admin', 'CategoryList_BatchSort',										'Category_Sort_By=' + encodeURIComponent( sort_by ) ); }

function CategoryCollectionIndex_Load_ID( category_id, collection_id, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryCollectionIndex_Load_ID',
	{
		Category_ID:	category_id,
		Collection_ID:	collection_id,
		Filter:			filter,
		Sort:			sort
	}, delegator );
}

function CategoryCollectionList_Load_Query( category_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryCollectionList_Load_Query',
	{
		Category_ID:	category_id,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function CategoryCollection_Add( category_id, collection_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryCollection_Add',
	{
		Category_ID:	category_id,
		Collection_ID:	collection_id
	}, delegator );
}

function CategoryCollection_Remove( category_id, collection_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryCollection_Remove',
	{
		Category_ID:	category_id,
		Collection_ID:	collection_id
	}, delegator );
}

function CategoryProductIndex_Load_ID( category_id, product_id, assigned, unassigned, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryProductIndex_Load_ID',
	{
		Category_ID:	category_id,
		Product_ID:		product_id,
		Filter:			filter,
		Sort:			sort,
		Assigned:		assigned,
		Unassigned:		unassigned
	}, delegator );
}

function CategoryProductList_Load_Query( category_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryProductList_Load_Query',
	{
		Category_ID:	category_id,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count,
		Assigned:		assigned,
		Unassigned:		unassigned
	}, delegator );
}

function CategoryProduct_Update_Assigned( category_id, product_id, assigned, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'CategoryProduct_Update_Assigned',								'Category_ID=' + encodeURIComponent( category_id ) + '&Product_ID=' + encodeURIComponent( product_id ) + '&Assigned=' + ( assigned ? '1' : '0' ), delegator ); }

function CategoryProductList_Update_Assigned( category_id, product_ids, assigned, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryProductList_Update_Assigned',
	{
		Category_ID:	category_id,
		Product_IDs:	product_ids,
		Assigned:		assigned
	}, delegator );
}

function CategoryPriceGroupList_Load_Query( category_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryPriceGroupList_Load_Query',
	{
		Category_ID:	category_id,
		Assigned:		assigned,
		Unassigned:		unassigned,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function CategoryAvailabilityGroupList_Load_Query( category_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CategoryAvailabilityGroupList_Load_Query',
	{
		Category_ID:	category_id,
		Assigned:		assigned,
		Unassigned:		unassigned,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function CategoryProductList_BatchSort( category_id, sort_by, callback )			{ return AJAX_Call( callback, 'admin', 'CategoryProductList_BatchSort',									'Category_ID=' + encodeURIComponent( category_id ) + '&Product_Sort_By=' + encodeURIComponent( sort_by ) ); }
function CategoryProductList_DisplayOrder_Update( category_id, fieldlist, callback ){ return AJAX_Call_FieldList( callback, 'admin', 'CategoryProductList_DisplayOrder_Update',				'Category_ID=' + encodeURIComponent( category_id ), fieldlist ); }
function ChildCategoryIndex_Load_ID( parentcategory_id, category_id, assigned, unassigned, filter, sort, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'ChildCategoryIndex_Load_ID',									'ParentCategory_ID=' + encodeURIComponent( parentcategory_id ) + '&Category_ID=' + encodeURIComponent( category_id ) + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Assigned=' + ( assigned ? '1' : '0' ) + '&Unassigned=' + ( unassigned ? '1' : '0' ), delegator ); }
function ChildCategoryList_Load_Query( parentcategory_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'ChildCategoryList_Load_Query',									'ParentCategory_ID=' + encodeURIComponent( parentcategory_id ) + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ) + '&Assigned=' + ( assigned ? '1' : '0' ) + '&Unassigned=' + ( unassigned ? '1' : '0' ), delegator ); }
function ChildCategory_Update_Assigned( parentcategory_id, category_id, assigned, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'ChildCategory_Update_Assigned',									'ParentCategory_ID=' + encodeURIComponent( parentcategory_id ) + '&Category_ID=' + encodeURIComponent( category_id ) + '&Assigned=' + ( assigned ? '1' : '0' ), delegator ); }
function ChildCategoryList_DisplayOrder_Update( parentcategory_id, fieldlist, callback )
																					{ return AJAX_Call_FieldList( callback, 'admin', 'ChildCategoryList_DisplayOrder_Update',				'ParentCategory_ID=' + encodeURIComponent( parentcategory_id ), fieldlist ); }

function HistoryList_Load_Query( filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'HistoryList_Load_Query',										'Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }																					
function HistoryList_Load( callback, delegator )									{ return AJAX_Call( callback, 'admin', 'HistoryList_Load',												'', delegator ); }																					
function History_Insert( title, action, module_code, callback, delegator )			{ return AJAX_Call( callback, 'admin', 'History_Insert',												'History_Title=' + encodeURIComponent( title ) + '&History_Action=' + encodeURIComponent( action ) + '&History_Module_Code=' + encodeURIComponent( module_code ), delegator ); }
function History_Delete( id, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'History_Delete',												'History_ID=' + encodeURIComponent( id ), delegator ); }
function HistoryList_Delete( history_ids, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'HistoryList_Delete',											'History_IDs=' + EncodeArray( history_ids ), delegator ); }
function History_Delete_Action( action, callback, delegator )						{ return AJAX_Call( callback, 'admin', 'History_Delete_Action',											'History_Action=' + encodeURIComponent( action ), delegator ); }
function History_Delete_All( callback, delegator )									{ return AJAX_Call( callback, 'admin', 'History_Delete_All',											'', delegator ); }

function MenuList_Load_Query( filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'MenuList_Load_Query',											'Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }																					

function StoreList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'StoreList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function StoreList_Load_All( callback, delegator )
{
	return AJAX_Call_Domain( callback,
							 'admin',
							 'StoreList_Load_All',
							 '',
							 delegator );
}

function StoreIcon_Upload( file_input, file_object, progress_object, delegator )
{
	return AJAX_Call_WithFile( progress_object, 'admin', 'StoreIcon_Upload', null, 'Image', file_input, file_object, delegator );
}

function BookmarkIndex_Load_ID( bookmark_id, filter, sort, callback, delegator )	{ return AJAX_Call( callback, 'admin', 'BookmarkIndex_Load_ID',											'Bookmark_ID=' + encodeURIComponent( bookmark_id ) + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ), delegator ); }
function BookmarkList_Load_Query( filter, sort, offset, count, callback, delegator )
																					{ return AJAX_Call( callback, 'admin', 'BookmarkList_Load_Query',										'Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ), delegator ); }																					

function Bookmark_Insert( title, action, module_code, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Bookmark_Insert',
	{
		Bookmark_Title:			title,
		Bookmark_Action:		action,
		Bookmark_Module_Code:	module_code
	}, delegator );
}

function Bookmark_Update( id, fieldlist, callback, delegator )						{ return AJAX_Call_FieldList( callback, 'admin', 'Bookmark_Update',										'Bookmark_ID=' + encodeURIComponent( id ), fieldlist, delegator ); }
function Bookmark_Delete( id, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'Bookmark_Delete',												'Bookmark_ID=' + encodeURIComponent( id ), delegator ); }
function BookmarkList_Delete( bookmark_ids, callback, delegator )					{ return AJAX_Call( callback, 'admin', 'BookmarkList_Delete',											'Bookmark_IDs=' + EncodeArray( bookmark_ids ), delegator ); }
function BookmarkList_DisplayOrder_Update( fieldlist, callback )					{ return AJAX_Call_FieldList( callback, 'admin', 'BookmarkList_DisplayOrder_Update',					'', fieldlist ); }

function UniversalSearch_Initialize( callback, delegator )							{ return AJAX_Call( callback, 'admin', 'UniversalSearch_Initialize',									'', delegator ); }
function UniversalSearchList_Load_Context( search, group_code, callback, delegator ){ return AJAX_Call( callback, 'admin', 'UniversalSearchList_Load_Context',								'Search=' + encodeURIComponent( search ) + '&Group_Code=' + encodeURIComponent( group_code ), delegator ); }

function NoteList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'NoteList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function Note_Insert( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'Note_Insert',
	{
		Customer_ID:	data.customer_id,
		Account_ID:		data.account_id,
		Order_ID:		data.order_id,
		NoteText:		data.notetext
	}, delegator );
}

function Note_Update( data, callback, delegator )									{ return AJAX_Call( callback, 'admin', 'Note_Update',													'Note_ID=' + encodeURIComponent( data.id ) + '&NoteText=' + encodeURIComponent( data.notetext ), delegator ); }
function Note_Delete( note_id, callback, delegator )								{ return AJAX_Call( callback, 'admin', 'Note_Delete',													'Note_ID=' + encodeURIComponent( note_id ), delegator ); }

function ProductCategoryIndex_Load_ID( product_id, category_id, assigned, unassigned, filter, sort, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'ProductCategoryIndex_Load_ID',
					  'Product_ID='		+ encodeURIComponent( product_id )	+
					  '&Category_ID='	+ encodeURIComponent( category_id )	+
					  '&Filter='		+ EncodeArray( filter )				+
					  '&Sort='			+ encodeURIComponent( sort )		+
					  '&Assigned='		+ ( assigned ? '1' : '0' )			+
					  '&Unassigned='	+ ( unassigned ? '1' : '0' ),
					  delegator );
}
function ProductCategoryList_Load_Query( product_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'ProductCategoryList_Load_Query',
					  'Product_ID='		+ encodeURIComponent( product_id )		+
					  '&Filter='		+ EncodeArray( filter )					+
					  '&Sort='			+ encodeURIComponent( sort )			+
					  '&Offset='		+ encodeURIComponent( offset )			+
					  '&Count='			+ encodeURIComponent( count )			+
					  '&Assigned='		+ ( assigned ? '1' : '0' )				+
					  '&Unassigned='	+ ( unassigned ? '1' : '0' ),
					  delegator );
}

function ProductCategoryList_Update_Assigned( product_id, category_ids, assigned, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductCategoryList_Update_Assigned',
	{
		Product_ID:		product_id,
		Category_IDs:	category_ids,
		Assigned:		assigned
	}, delegator );
}

function ProductPriceGroupList_Load_Query( product_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'ProductPriceGroupList_Load_Query',
					  'Product_ID='		+ encodeURIComponent( product_id )	+
					  '&Assigned='		+ ( assigned ? 1 : 0 )				+
					  '&Unassigned='	+ ( unassigned ? 1 : 0 )			+
					  '&Filter='		+ EncodeArray( filter )				+
					  '&Sort='			+ encodeURIComponent( sort )		+
					  '&Offset='		+ encodeURIComponent( offset )		+
					  '&Count='			+ encodeURIComponent( count ),
					  delegator );
}

function ProductAvailabilityGroupList_Load_Query( product_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'ProductAvailabilityGroupList_Load_Query',
	{
		Product_ID:	product_id,
		Assigned:	assigned,
		Unassigned:	unassigned,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function StoreModuleList_Load( module_type, callback ) { return AJAX_Call( callback, 'admin', 'StoreModuleList_Load', 'Module_Type=' + encodeURIComponent( module_type ) ); }
function StoreModule_AssignUnassign( module_id, module_type, confirmation, callback ) { return AJAX_Call( callback, 'admin', 'StoreModule_AssignUnassign', 'Module_ID=' + encodeURIComponent( module_id ) + '&Module_Type=' + encodeURIComponent( module_type ) + '&Warning_Confirmed=' + ( confirmation ? '1' : '0' ) ); }

function StateList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'StateList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function StateIndex_Load_Code( code, filter, sort, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'StateIndex_Load_Code',
	{
		State_Code:	code,
		Filter:		filter,
		Sort:		sort
	}, delegator );
}

function StateList_DisplayOrder_Update( fieldlist, callback )
{
	return AJAX_Call_FieldList( callback, 'admin', 'StateList_DisplayOrder_Update', '', fieldlist );
}

function State_Update( original_code, fieldlist, callback, delegator )								
{ 
	return AJAX_Call_FieldList( callback, 'admin', 'State_Update',						
								'Original_State_Code=' + encodeURIComponent( original_code ),
								fieldlist,
								delegator );
}

function State_Insert( fieldlist, callback, delegator )
{ 
	return AJAX_Call_FieldList( callback, 'admin', 'State_Insert',
								'',
								fieldlist,
								delegator );
}

function State_Delete( fieldlist, callback, delegator )
{
	return AJAX_Call_FieldList( callback, 'admin', 'State_Delete',
								'', 
								fieldlist,
								delegator );
}																					

function ScreenTabList_Load( fieldlist, callback, delegator )
{
	var i, parameters;

	parameters		= new Array();

	for ( i = 0; i < fieldlist.length; i++ )
	{
		parameters.push( encodeURIComponent( fieldlist[ i ].name ) + '=' + encodeURIComponent( fieldlist[ i ].value ) );
	}

	parameters		= parameters.join( '&' );

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/x-www-form-urlencoded',
							   AJAX_Append_SessionParameters( parameters, 'admin' ),
							   'Function=ScreenTabList_Load',
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-ADM-FCN-00002';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ScreenTabList_Load\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AuthorizationFailureList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'AuthorizationFailureList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function AuthorizationFailureList_Delete( failure_ids, callback, delegator )
{
	return AJAX_Call( callback, 'admin', 'AuthorizationFailureList_Delete',
					  'AuthorizationFailure_IDs=' + EncodeArray( failure_ids ),
					  delegator );
}

function AuthorizationFailure_Blacklist_IPs( data, callback )
{
	return AJAX_Call( callback, 'admin', 'AuthorizationFailure_Blacklist_IPs',
				  	  'AuthorizationFailure_Blacklist_IPs='					+ EncodeArray( data.IPs )						+
					  '&AuthorizationFailure_Blacklist_Expires_Mode='		+ encodeURIComponent( data.expires_mode )		+
					  '&AuthorizationFailure_Blacklist_Expires_In='			+ encodeURIComponent( data.expires_in )			+
					  '&AuthorizationFailure_Blacklist_Expires_In_Unit='	+ encodeURIComponent( data.expires_in_unit )	+
					  '&AuthorizationFailure_Blacklist_Expires_On='			+ encodeURIComponent( data.expires_on ) );
}

function AllOrderPaymentList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'AllOrderPaymentList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function APITokenList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'APITokenList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function APITokenList_Delete( failure_ids, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'APITokenList_Delete',
							 'APIToken_IDs=' + EncodeArray( failure_ids ),
							 delegator );
}

function APIToken_Insert( data, callback, delegator )
{ 
	return AJAX_Call_Domain_JSON( callback, 'admin', 'APIToken_Insert',
	{
		APIToken_Name:				data.name,
		APIToken_Token:				data.token,
		APIToken_IP_Range:			data.ip_range,
		APIToken_Require_Signature:	data.req_sig,
		APIToken_SigningKey:		data.signkey,
		APIToken_Require_Timestamp:	data.req_ts,
		APIToken_Timestamp_Window:	data.ts_window,
		APIToken_GroupIDs:			data.assigned_group_ids
	}, delegator );
}

function APIToken_Update( token_id, data, callback, delegator )								
{ 
	return AJAX_Call_Domain_JSON( callback, 'admin', 'APIToken_Update',
	{
		APIToken_ID:				token_id,
		APIToken_Name:				data.name,
		APIToken_Token:				data.token,
		APIToken_IP_Range:			data.ip_range,
		APIToken_Require_Signature:	data.req_sig,
		APIToken_SigningKey:		data.signkey,
		APIToken_Require_Timestamp:	data.req_ts,
		APIToken_Timestamp_Window:	data.ts_window
	}, delegator );
}

function APIToken_Update_Enabled( token_id, enabled, callback, delegator )								
{ 
	return AJAX_Call_Domain_JSON( callback, 'admin', 'APIToken_Update_Enabled',
	{
		APIToken_ID:		token_id,
		APIToken_Enabled:	enabled
	}, delegator );
}

function APIToken_Generate_SigningKey( callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'APIToken_Generate_SigningKey', '', delegator );
}

function APIToken_Generate_Token( callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'APIToken_Generate_Token', '', delegator );
}

function APIToken_FunctionList_Load( token_id, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'APIToken_FunctionList_Load',
							 'APIToken_ID=' + encodeURIComponent( token_id ),
							 delegator );
}

function GroupAPITokenList_Load_Query( group_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'GroupAPITokenList_Load_Query',
	{
		Group_ID:	group_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count,
		Assigned:	assigned,
		Unassigned:	unassigned
	}, delegator );
}

function APITokenGroupList_Load_Query( token_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'APITokenGroupList_Load_Query',
	{
		APIToken_ID:	token_id,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count,
		Assigned:		assigned,
		Unassigned:		unassigned
	}, delegator );
}

function APITokenGroup_Update_Assigned( group_id, store_id, token_id, assigned, callback, delegator )
{
	return AJAX_Call_Domain( callback, 'admin', 'APITokenGroup_Update_Assigned',
							 'Group_ID='		+ encodeURIComponent( group_id )	+
							 '&Store_ID='		+ encodeURIComponent( store_id )	+
							 '&APIToken_ID='	+ encodeURIComponent( token_id )	+
							 '&Assigned='		+ ( assigned ? '1' : '0' ),
							 delegator );
}

function APITokenFunctionList_Load_Query( token_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'APITokenFunctionList_Load_Query',
	{
		APIToken_ID:	token_id,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function APITokenFunction_Insert( token_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Domain_FieldList( callback, 'admin', 'APITokenFunction_Insert',
									   'APIToken_ID='		+ encodeURIComponent( token_id ),
									   fieldlist, delegator );
}

function APITokenFunction_Delete( token_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Domain_FieldList( callback, 'admin', 'APITokenFunction_Delete',
									   'APIToken_ID='		+ encodeURIComponent( token_id ),
									   fieldlist, delegator );
}

function CacheSettingList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CacheSettingList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function CacheSetting_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_JSON_FieldList( callback, 'admin', 'CacheSetting_Insert', null, fieldlist, delegator );
}

function CacheSetting_Update( type, name, fieldlist, callback, delegator )
{
	return AJAX_Call_JSON_FieldList( callback, 'admin', 'CacheSetting_Update', 
	{
		Edit_CacheSetting_Type: type,
		Edit_CacheSetting_Name: name
	}, fieldlist, delegator );
}

function CacheSetting_Delete( type, name, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'admin', 'CacheSetting_Delete',
	{
		Edit_CacheSetting_Type: type,
		Edit_CacheSetting_Name: name
	}, delegator );
}

function Cache_Flush( callback )
{
	return AJAX_Call_JSON( callback, 'admin', 'Cache_Flush' );
}

function AdminInlineHelp_Load_Article( article, callback, delegator )
{
	return AJAX_Call_Domain_JSON( callback, 'admin', 'AdminInlineHelp_Load_Article',
	{
		Article: article
	}, delegator );
}
