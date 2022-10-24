export interface IMarkerType {
  url: string;
  title: string;
}

export class MarkerTypes {
  getTypes(): IMarkerType[] {
    return [
      {
        url: '',
        title: 'Default color'
      },
      {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        title: 'Green color'
      },
      {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        title: 'Blue color'
      },
      {
        url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        title: 'Purple color'
      },
      {
        url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        title: 'Yellow color'
      },
      {
        url: 'http://maps.google.com/mapfiles/kml/pal3/icon26.png',
        title: 'Shopping basket'
      },
      {
        url: 'http://maps.google.com/mapfiles/kml/pal3/icon39.png',
        title: 'Danger point'
      },
      {
        url: 'http://maps.google.com/mapfiles/kml/pal3/icon38.png',
        title: 'Medicine point'
      }
    ]
  }
}