/**
 * Steve Melendez
 * Based off videojs-ttml project @ https://github.com/SRGSSR/videojs-ttml
 */
(function(factory) {
    if (typeof define === 'function' && define['amd']) {
        define('videojs-ttml',['video.js'], function(videojs){ factory(window, document, videojs) });
    } else if (typeof exports === 'object' && typeof module === 'object') {
        var vjs = require('video.js');
        factory(window, document, vjs);
    } else {
        factory(window, document, videojs);
    }
})(function (window, document, videojs) {

    function VideoJSTTMLParser() {
        this.domParser = new DOMParser();
    }

    VideoJSTTMLParser.prototype = {
        parseTTMLCue: function(p) {
            var begin = p.getAttribute('begin').split(':');
            var end = p.getAttribute('end').split(':');
            var sTime = (((parseFloat(begin[0]) * 60) + parseFloat(begin[1])) * 60) + parseFloat(begin[2]);
            var eTime = (((parseFloat(end[0]) * 60) + parseFloat(end[1])) * 60) + parseFloat(end[2]);
            var text = p.textContent;
            text = text.trim();
            text = text.replace('<![CDATA[', '');
            text = text.replace(']]>', '');

            return {
                startTime: sTime,
                endTime: eTime,
                text: text
            };
        },
        parseTTML: function(ttml) {
            var cueElements = this.domParser.parseFromString(ttml, 'text/xml').getElementsByTagName('p');
            var cues = [];

            if (cueElements.length > 0) {
                for (var i = 0; i < cueElements.length; i++) {
                    cues = cues.concat(this.parseTTMLCue(cueElements[i]));
                }
            } else {
                cues.push({
                    startTime: 0.00,
                    endTime: 99999.99,
                    text: 'Captions are unavailable'
                });
            }
            return cues;
        }
    };

    var VideoJSTTML = function() {
        var _this = this;
        var Player = {
            addRemoteTextTrack: _this.addRemoteTextTrack
        };

        this.addRemoteTextTrack = function(options) {
            var parser = new VideoJSTTMLParser();
            var src = options.src;
            var isTTML = options.type && options.type === 'application/ttml+xml';
            var element;

            element = Player.addRemoteTextTrack.apply(this, arguments);

            if (isTTML && element && element.track) {
                var track = element.track;
                track.loaded_ = false;
                videojs.xhr(src, {}, function(err, response, responseBody) {
                    var isEmulated = false;
                    if (err || response.statusCode >= 300) {
                        isEmulated = true;
                    }
                    
                    if (isEmulated) {
                        element.track.addCue(new VTTCue(0.00,9999.99,'Captions Unavailable'));
                    } else {
                        track.loaded_ = true;
                        var cues = parser.parseTTML(responseBody);

                        for (var i = 0; i < cues.length; i++) {
                            var cue = new VTTCue(cues[i].startTime, cues[i].endTime, cues[i].text);
                            element.track.addCue(cue);
                        }
                    }
                    
                }.bind(this));
            }

            return element;
        };
    };

    videojs.plugin('VideoJSTTML', VideoJSTTML);
});
  