export const FSEvent = (name, properties) => {
  if ( window.FS && window.FS.event ) {
    window.FS.event(name, properties);
  }
  console.log('FSEvent', name, properties);
}