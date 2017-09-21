# Videojs Frankly TTML Plugin

> A TTML plugin for video.js for use with TTML by converting TTML to VTTCue.

This plugin makes it possible use TTML text tracks on VideoJS. It parses the TTML XML into a VTT Cue. For empty TTML files, it generates a VTT Cue saying Captions Unavailable. If the source TTML fails, it will also generate a track to say Captions Unavailable.

- [Getting Started](#getting-started)
- [Dependencies](#dependencies)

## Getting Started

Download videojs-frankly-ttml and include it in your page along with video.js. To use this plugin you must set `nativeTextTracks` to `false`:

```html
<video id="example-video" width=600 height=300 class="video-js vjs-default-skin" controls>
  <source
     src="http://example.com/index.mp4"
     type="video/mp4">
  <track
     src="http://example.com/captions.xml"
     kind="captions"
     srclang="en"
     label="English Captions"
     type="application/ttml+xml">
</video>
<script src="video.js"></script>
<script src="videojs-frankly-ttml.js"></script>
<script>
var player = videojs('example-video', { plugins: { ttml: {} }, nativeTextTracks: false }, function() {
    // Print a list of available textracks
    console.log(this.textTracks());
});
</script>
```