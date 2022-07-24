import { useEffect, useState } from "react";

const toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10);
  var days = Math.floor(sec_num / (3600 * 24));
  var hours = Math.floor((sec_num / 3600) % 24);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  const hms = [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");

  if (days > 0) {
    return `${days} Days ${hms}`;
  }

  return hms;
};

export default function useCountdown(mintingBeginsFrom) {
  const [remaining, setRemaining] = useState();

  useEffect(() => {
    let interval;
    const _now = Date.now();
    if (mintingBeginsFrom && mintingBeginsFrom > _now) {
      let diff = (mintingBeginsFrom - _now) / 1000;

      function tick() {
        if (diff <= 0) {
          setRemaining(null);
          clearInterval(interval);
          return;
        }
        let hhmmss = toHHMMSS(diff);
        setRemaining(hhmmss);
        diff--;
      }

      tick();
      interval = setInterval(tick, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [mintingBeginsFrom]);

  return remaining;
}
