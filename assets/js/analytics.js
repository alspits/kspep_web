(() => {
  const counterId = 114091341;
  const goals = {
    telegram: 'contact_telegram',
    max: 'contact_max',
    email: 'contact_email',
  };

  function trackContact(event) {
    if (event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1)) return;
    const link = event.target?.closest?.('a[data-contact-channel]');
    const channel = link?.dataset.contactChannel;
    if (!Object.hasOwn(goals, channel) || typeof window.ym !== 'function') return;

    const params = {
      channel,
      placement: link.closest('section')?.id || 'other',
    };

    // Analytics must never interrupt navigation or send message contents.
    try {
      window.ym(counterId, 'reachGoal', goals[channel], params);
      window.ym(counterId, 'reachGoal', 'contact_click', params);
    } catch {
      // Contact links remain usable if analytics is unavailable.
    }
  }

  document.addEventListener('click', trackContact);
  document.addEventListener('auxclick', trackContact);
})();
