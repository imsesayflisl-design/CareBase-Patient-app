import { Linking, Platform } from 'react-native';

type DirectionsTarget = {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  label?: string | null;
};

/**
 * Opens the platform navigation app for a destination.
 * Prefers precise coordinates when the backend provides them, otherwise falls
 * back to an address search. Returns false when no destination is available.
 */
export async function openDirections(target: DirectionsTarget): Promise<boolean> {
  const { latitude, longitude, address, label } = target;

  const hasCoords = latitude != null && longitude != null;
  if (!hasCoords && !address) return false;

  const destination = hasCoords ? `${latitude},${longitude}` : address!;
  const encoded = encodeURIComponent(destination);
  const name = encodeURIComponent(label ?? destination);

  const url = Platform.select({
    ios: hasCoords
      ? `maps:0,0?q=${name}@${destination}`
      : `maps:0,0?q=${encoded}`,
    android: hasCoords
      ? `geo:${destination}?q=${destination}(${name})`
      : `geo:0,0?q=${encoded}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
  })!;

  const supported = await Linking.canOpenURL(url).catch(() => false);
  if (supported) {
    await Linking.openURL(url);
    return true;
  }

  await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`);
  return true;
}

export async function callPhone(phone?: string | null): Promise<boolean> {
  if (!phone) return false;
  const url = `tel:${phone.replace(/\s+/g, '')}`;
  const supported = await Linking.canOpenURL(url).catch(() => false);
  if (!supported) return false;
  await Linking.openURL(url);
  return true;
}
