import { AppNotification } from '../types/sparePart';
import { playShipyardAlertSound } from './audio';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

export function triggerDeviceVibration(priority: 'normal' | 'urgent' | 'critical' | 'success') {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      if (priority === 'critical' || priority === 'urgent') {
        navigator.vibrate([150, 80, 150, 80, 250]);
      } else {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Ignore vibration errors if restricted
    }
  }
}

export function showBrowserNotification(notification: AppNotification) {
  // Always trigger sound and vibration
  playShipyardAlertSound(notification.priority);
  triggerDeviceVibration(notification.priority);

  if (!isNotificationSupported()) return;

  if (Notification.permission === 'granted') {
    try {
      const options: NotificationOptions & { renotify?: boolean } = {
        body: notification.message,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: notification.id,
        renotify: true,
        data: {
          url: window.location.href,
          partId: notification.partId,
        },
      };

      const nativeNotif = new Notification(notification.title, options);
      nativeNotif.onclick = () => {
        window.focus();
        nativeNotif.close();
      };
    } catch (err) {
      console.warn('Native notification failed:', err);
    }
  }
}
