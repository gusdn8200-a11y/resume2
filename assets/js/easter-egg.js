(() => {
  const art = [
    '  (\\_/)',
    '  ( •_•)',
    ' / >  쿠키',
  ].join('\n');

  const message = [
    '콘솔까지 찾아오다니!',
    '구경해줘서 고마워요.',
    '좋은 하루 보내세요.',
  ].join('\n');

  const style = [
    'color:#ffb020',
    'font-family:monospace',
    'font-size:12px',
    'line-height:1.2',
  ].join(';');

  console.log('%c' + art + '\n' + message, style);
})();
