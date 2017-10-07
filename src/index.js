'use strict';

/**
 * Event: 'data'
 * Added in: v0.1.90
 *
 * <Buffer>
 * Emitted when data is received. The argument data will be a Buffer or String.
 * Encoding of data is set by socket.setEncoding(). (See the Readable Stream section for more information.)
 *
 * Note that the data will be lost if there is no listener when a Socket emits a 'data' event.
 *
 * @link https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#what-we-ve-got-so-far
 * @link https://nodejs.org/dist/latest-v6.x/docs/api/net.html#net_event_data
 * @link https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_class_stream_readable
 *
 * @param {IncomingMessage} req
 * @param {string} req.body
 * @param {Object} req.data
 * @param {Array} req.headers
 * @param {string} req.method
 * @param {Function} req.on
 *
 * @param {ServerResponse} res
 * @param {Function} next
 */
function dataRequestHandler( req, res, next ) {
  var Server = this;

  if ( Server.debug ) {
    console.log( '[debug]', new Date(), 'dataRequestHandler() [ ' + req.method + ' ]' );
  }

  if ( !req.data ) {
    req.data = {
      content_length: parseInt( req.headers[ 'content-length' ], 10 ) || undefined,
      chunks: []
    };
  }

  req.on(
    'data',
    function ( chunk ) {
      if ( Server.debug ) {
        console.log( '[debug]', new Date(), 'dataRequestHandler() req.on.data' );
      }

      req.data.chunks.push( chunk );
    }
  );

  req.on(
    'end',
    function ( chunk ) {
      if ( Server.debug ) {
        console.log( '[debug]', new Date(), 'dataRequestHandler() req.on.end' );
      }

      if ( chunk ) {
        req.data.chunks.push( chunk );
      }

      req.body = Buffer.concat( req.data.chunks, req.data.content_length ).toString();

      return next();
    }
  );
}

module.exports = dataRequestHandler;
