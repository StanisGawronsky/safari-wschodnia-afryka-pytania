import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { routeLine, routePlaces, type RoutePlace } from '../data/places';

function FitRouteBounds() {
    const map = useMap();

    useEffect(() => {
        map.fitBounds(L.latLngBounds(routeLine), { padding: [48, 48] });
    }, [map]);

    return null;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function placeIcon(place: RoutePlace) {
    const label = `${place.order}-${place.name}`;
    return L.divIcon({
        className: 'route-marker-wrap',
        html: `<span class="route-marker__pill">${escapeHtml(label)}</span>`,
        iconAnchor: [0, 0],
        popupAnchor: [0, -12],
    });
}

type RouteMapProps = {
    selectedPlaceId?: string | null;
    onSelectPlace?: (place: RoutePlace) => void;
};

export function RouteMap({ selectedPlaceId, onSelectPlace }: RouteMapProps) {
    return (
        <MapContainer className="route-map" center={[-2, 36]} zoom={6} scrollWheelZoom>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitRouteBounds />
            <Polyline positions={routeLine} pathOptions={{ color: '#2563eb', weight: 3, opacity: 0.75 }} />
            {routePlaces.map((place) => (
                <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={placeIcon(place)}
                    opacity={selectedPlaceId && selectedPlaceId !== place.id ? 0.55 : 1}
                    eventHandlers={{
                        click: () => onSelectPlace?.(place),
                    }}
                >
                    <Popup>
                        <strong>
                            {place.order}-{place.name}
                        </strong>
                        {onSelectPlace && (
                            <div className="map-popup-actions">
                                <button type="button" onClick={() => onSelectPlace(place)}>
                                    Pokaż pytania
                                </button>
                            </div>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
