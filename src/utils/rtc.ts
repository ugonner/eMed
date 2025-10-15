// sdpUtils.ts

import { CallQuality } from "../call/enums/call.enum";

export function modifySDPForBandwidth(sdp: string, quality: CallQuality) {
  return sdp;
  // let bandwidth = 0;

  // switch (quality) {
  //   case CallQuality.VERY_LOW:
  //     bandwidth = 150;
  //     break;
  //   case CallQuality.LOW:
  //     bandwidth = 512;
  //     break;
  //   case CallQuality.HIGH:
  //     bandwidth = 1024;
  //     break;
  // }

  // return sdp.replace(/m=video.*\r\n/g, match => match + `b=AS:${bandwidth}\r\n`);
}

export function preferVP8Codec(sdp: string) {
  //return sdp;
  const vp8Regex = /a=rtpmap:(\d+) VP8\/90000/;
  const match = sdp.match(vp8Regex);
  if (!match) return sdp;

  const vp8Payload = match[1];

  return sdp.replace(/m=video .*\r\n/, line => {
    const parts = line.trim().split(' ');
    const newLine = parts.slice(0, 3).concat(vp8Payload).join(' ') + '\r\n';
    return newLine;
  });
}
