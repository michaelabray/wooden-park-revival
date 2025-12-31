import { NEWS_MESSAGES } from '@/lib/gameUtils';

export function NewsTicker() {
  // Duplicate messages for seamless looping
  const allMessages = [...NEWS_MESSAGES, ...NEWS_MESSAGES];

  return (
    <div className="ticker-container">
      <div className="ticker-text">
        {allMessages.map((msg, i) => (
          <span key={i} className="mx-8 text-primary-foreground/90">
            <span className="text-accent mr-2">◆</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
