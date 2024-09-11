// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2019 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

(function( obj, eventType, fn )
{
	if ( obj.addEventListener )
	{
		obj.addEventListener( eventType, fn, false );
	}
	else if ( obj.attachEvent )
	{
		obj.attachEvent( 'on' + eventType, fn );
	}
})( window, 'load', function() { ImageMachine_Initialize(); } );

function ImageMachine_Initialize()
{
	FireEvent( window, 'imagemachine_override' );
	FireEvent( window, 'imagemachine_initialize' );
}

function ImageMachine( product_code, variant_id, main_image, thumbnails, closeup_div, closeup_image, closeup_close, image_type, image_size, image_width, image_height, closeup_active, closeup_size, closeup_width, closeup_height, thumb_active, thumb_width, thumb_height, preload, legacy_uri )
{
	var self					= this;

	this.main_image				= ( document.getElementById( main_image ) )		? document.getElementById( main_image )		: 'undefined';
	this.thumbnails				= ( document.getElementById( thumbnails ) )		? document.getElementById( thumbnails )		: 'undefined';
	this.closeup_div			= ( document.getElementById( closeup_div ) )	? document.getElementById( closeup_div )	: 'undefined';
	this.closeup_image			= ( document.getElementById( closeup_image ) )	? document.getElementById( closeup_image )	: 'undefined';
	this.closeup_close			= ( document.getElementById( closeup_close ) )	? document.getElementById( closeup_close )	: 'undefined';
	this.closeup_backing		= document.createElement( 'div' );

	this.product_code			= product_code;
	this.variant_id				= variant_id;
	this.current_type			= image_type;
	this.main_size				= image_size;
	this.main_width				= image_width;
	this.main_height			= image_height;
	this.closeup_active			= closeup_active;
	this.closeup_size			= closeup_size;
	this.closeup_width			= closeup_width;
	this.closeup_height			= closeup_height;
	this.thumb_active			= thumb_active;
	this.thumb_width			= thumb_width;
	this.thumb_height			= thumb_height;
	this.preload				= preload;
	this.legacy_uri				= legacy_uri;

	this.main_image_loaded		= false;
	this.closeup_image_loaded	= false;

	this.main_index				= 0;

	if( this.thumb_active )							this.thumb_index	= 1;
	if( this.thumb_index && this.closeup_active )	this.closeup_index	= 2;
	else if( this.closeup_active )					this.closeup_index	= 1;

	if( typeof MivaEvents !== 'undefined' )
	{
		MivaEvents.SubscribeToEvent( 'variant_changed', function( product_data )
		{
			if( product_data.product_code === self.product_code )
			{
				self.Update_Variant( product_data.variant_id );
			}
		} );
	}

	if( this.closeup_image !== 'undefined' && this.closeup_active )
	{
		AddEvent( this.closeup_image, 'load', function(){ self.closeup_image.style.display = 'inline'; self.Closeup_Position(); } );

		this.closeup_backing.className	= 'closeup_backing';
		
		AddEvent( window, 'load', function(){ document.body.appendChild( self.closeup_backing ); } );	
	}
}

ImageMachine.prototype.oninitialize				= function( data )
{
	this.Initialize( data );
}

ImageMachine.prototype.onthumbnailimageclick	= function( data )
{
	this.Thumbnail_Click( data );
}

ImageMachine.prototype.onmainimageclick			= null;
ImageMachine.prototype.oncloseupimageclick		= null;

ImageMachine.prototype.Initialize = function( data )
{
	var self = this;
	var i, thumbnail;

	this.data	= data;

	if( this.main_image === 'undefined' )		return;

	if( this.thumbnails !== 'undefined' )		this.Clear_Thumbnails( this.thumbnails );
	if( this.closeup_image !== 'undefined' )	this.closeup_image.src = '';
	
	if( data.length === 0 )
	{
		if( this.legacy_uri )
		{
			this.main_image.src = this.legacy_uri;
		}
		else
		{
			this.main_image.src = 'graphics/en-US/admin/blank.gif';
		}

		return;
	}
	
	this.main_image.src = data[ 0 ].image_data[ this.main_index ];

	if( this.closeup_active && this.closeup_div !== 'undefined' && this.closeup_image !== 'undefined' && this.closeup_close !== 'undefined' )
	{
		if ( this.onmainimageclick )	AddEvent( this.main_image, 'click', function(){ self.onmainimageclick(); } );
		else							AddEvent( this.main_image, 'click', function(){ self.Closeup_Open(); } );

		if ( this.oncloseupimageclick )
		{
			AddEvent( this.closeup_div,		'click', function(){ self.oncloseupimageclick(); } );
			AddEvent( this.closeup_backing, 'click', function(){ self.oncloseupimageclick(); } );
		}
		else
		{
			AddEvent( this.closeup_div,		'click', function(){ self.Closeup_Close(); } );
			AddEvent( this.closeup_backing, 'click', function(){ self.Closeup_Close(); } );
		}

		this.closeup_image.src = data[ 0 ].image_data[ this.closeup_index ];

		if( this.main_image !== 'undefined' ) this.main_image.style.cursor = 'pointer';
		
	}

	if( this.thumb_active && ( this.thumbnails !== 'undefined' ) )
	{
		for( i = 0; i < data.length; i++ )
		{
			if( this.current_type && ( data[ i ].type_code === this.current_type ) )
			{
				this.main_image.src = data[ i ].image_data[ this.main_index ];
				if( this.closeup_active && this.closeup_image !== 'undefined' ) this.closeup_image.src = data[ i ].image_data[ this.closeup_index ];
			}
			
			thumbnail		= this.ImageMachine_Generate_Thumbnail( data[ i ].image_data[ this.thumb_index ]	? data[ i ].image_data[ this.thumb_index ] :	null,
																	data[ i ].image_data[ this.main_index ]		? data[ i ].image_data[ this.main_index ] :		null,
																	data[ i ].image_data[ this.closeup_index ]	? data[ i ].image_data[ this.closeup_index ]:	null,
																	data[ i ].type_code );
			thumbnail.mm5_thumbnail = data[ i ];

			AddEvent( thumbnail, 'click', function()
			{
				var node;

				if ( this.mm5_thumbnail )	node = this;
				else if ( window.event )	node = window.event.srcElement;
				else						node = null;

				while ( node && !node.mm5_thumbnail )
				{
					node = node.parentNode;
				}

				if ( node )					self.onthumbnailimageclick( node.mm5_thumbnail );
			} );

			if( data.length > 1 ){	this.thumbnails.appendChild( thumbnail ); }
		}
	}
	else
	{
		if( this.closeup_active && this.closeup_image !== 'undefined' ) this.closeup_image.src = data[ 0 ].image_data[ this.closeup_index ];
	}


	if( ! this.main_image.getAttribute( 'src', 2 ) && this.current_type.length ) this.main_image.src = data[ 0 ].image_data[ this.main_index ];
	
	if( this.preload ) { this.Preload( data, 0 ); }
}

ImageMachine.prototype.Thumbnail_Click = function( image_object )
{
	this.main_image.src = image_object.image_data[ this.main_index ];
	this.current_type	= image_object.type_code;

	if( this.closeup_active && this.closeup_image !== 'undefined' )
	{
		this.closeup_image.style.display	= 'none';
		this.closeup_image.src				= '';
		this.closeup_image.src				= image_object.image_data[ this.closeup_index ];
	}
}

ImageMachine.prototype.Update_Variant = function( variant_id )
{
	var self	= this;
	var query	= []

	if ( this.variant_id === variant_id )
	{
		return;
	}

	query.push( ( this.main_size === 'N' ) ? 'original' : this.main_width + 'x' + this.main_height );
	
	if( this.thumb_active )		query.push( this.thumb_width + 'x' + this.thumb_height + ':MultipleOnly' );
	if( this.closeup_active )	query.push( ( this.closeup_size === 'N' ) ? 'original' : this.closeup_width + 'x' + this.closeup_height );
	
	Runtime_ProductImageList_Load_Product_Variant( this.product_code, variant_id, query, function( response )
	{ 
		if( !response.success )
		{
			return;
		}
	
		self.variant_id = variant_id;	
		self.oninitialize( response.data );
	} );
}

ImageMachine.prototype.Clear_Thumbnails = function( container )
{
	while( container.hasChildNodes() )
	{
		container.removeChild( this.thumbnails.lastChild );
	}
}

ImageMachine.prototype.Closeup_Open = function()
{
	var self = this;

	window.onresize = function(){ self.Closeup_Resize( self ); }
	
	this.closeup_div.style.display		= 'inline';
	this.closeup_backing.style.display	= 'inline';

	if( document.documentElement.clientHeight > document.body.scrollHeight )
	{
		this.closeup_backing.style.height	=	document.documentElement.clientHeight + 'px';
	}
	else
	{
		this.closeup_backing.style.height	= ( document.body.scrollHeight > document.documentElement.scrollHeight ) ? document.body.scrollHeight + 'px' : document.documentElement.scrollHeight + 'px';
	}

	this.Closeup_Position();
}

ImageMachine.prototype.Closeup_Resize = function( self )
{
	if( document.documentElement.clientHeight > document.body.scrollHeight )
	{
		self.closeup_backing.style.height	=	document.documentElement.clientHeight + 'px';
	}
	else
	{
		self.closeup_backing.style.height	= ( document.body.scrollHeight > document.documentElement.scrollHeight ) ? document.body.scrollHeight + 'px' : document.documentElement.scrollHeight + 'px';
	}

	self.Closeup_Position();
}

ImageMachine.prototype.Closeup_Close = function()
{
	window.onresize						= null;

	this.closeup_backing.style.display	= 'none';
	this.closeup_div.style.display		= 'none';
}

ImageMachine.prototype.Closeup_Position = function()
{
	this.closeup_div.style.left = ( ( document.body.offsetWidth / 2 ) - ( this.closeup_div.offsetWidth / 2 ) ) + 'px';
}

ImageMachine.prototype.Preload = function( image_array, pos )
{
	var self = this;
	var main, closeup;

	this.main_image_loaded		= false;
	this.closeup_image_loaded	= false;

	if ( pos >= image_array.length )
	{
		return;
	}

	main = new Image();

	AddEvent( main, 'load', function()
	{
		self.main_image_loaded = true;

		if ( self.closeup_image_loaded )
		{
			self.Preload( image_array, ( pos + 1 ) );
		}
	} );

	main.src = image_array[ pos ].image_data[ this.main_index ];

	if ( this.closeup_active && this.closeup_index && image_array[ pos ].image_data[ this.closeup_index ] )
	{
		closeup = new Image();

		AddEvent( closeup, 'load', function()
		{
			self.closeup_image_loaded = true;

			if ( self.main_image_loaded )
			{
				self.Preload( image_array, ( pos + 1 ) );
			}
		} );
		
		closeup.src = image_array[ pos ].image_data[ this.closeup_index ];
	}
}
