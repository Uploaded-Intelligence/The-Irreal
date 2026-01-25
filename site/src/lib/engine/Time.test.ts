import { describe, it, expect, vi } from 'vitest';
import { Time } from './Time';

describe('Time Engine', () => {
  it('should emit tick events', () => {
    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (fn: any) => setTimeout(fn, 16));
    vi.stubGlobal('cancelAnimationFrame', clearTimeout);

    const time = new Time();
    const spy = vi.fn();
    time.on('tick', spy);
    
    // Simulate frame manually if possible, or wait
    // Since Time starts loop in constructor, we might need to wait or mock better.
    // For this test, let's just call tick manually to verify logic, 
    // assuming the loop structure works if manual tick works.
    
    time.tick();
    
    expect(spy).toHaveBeenCalled();
    expect(time.delta).toBeDefined();
    expect(time.elapsed).toBeDefined();
  });
});
