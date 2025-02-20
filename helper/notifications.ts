export const showNotification = (title: string, body: string) => {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/images/invoiceLogo.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body,
            icon: "/images/invoiceLogo.png",
          });
        }
      });
    }
  }
};

export const playNotificationSound = () => {
  const audio = new Audio("/audio/notification-two.wav");
  audio.play().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Error playing notification sound:", error);
  });
};
