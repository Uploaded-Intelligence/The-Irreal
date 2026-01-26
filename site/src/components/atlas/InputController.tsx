import { useEffect } from 'react';
import { useAtlasStore } from '../../stores/atlasStore';

export function InputController() {
  const setMoveDirection = useAtlasStore((s) => s.setMoveDirection);
  const setBoosting = useAtlasStore((s) => s.setBoosting);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const cancelHyperdrive = useAtlasStore((s) => s.cancelHyperdrive);
  const focusNextNode = useAtlasStore((s) => s.focusNextNode);
  const focusPrevNode = useAtlasStore((s) => s.focusPrevNode);
  const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);
  const toggleHUD = useAtlasStore((s) => s.toggleHUD);

  useEffect(() => {
    const keys = new Set<string>();

    const updateMovement = () => {
      // Disable movement during hyperdrive travel
      if (hyperdrive.phase !== 'idle') {
        setMoveDirection({ forward: 0, right: 0, up: 0 });
        return;
      }

      let forward = 0, right = 0, up = 0;

      if (keys.has('w') || keys.has('arrowup')) forward -= 1;    // W = forward (negative Z)
      if (keys.has('s') || keys.has('arrowdown')) forward += 1;  // S = backward
      if (keys.has('d') || keys.has('arrowright')) right += 1;   // D = right
      if (keys.has('a') || keys.has('arrowleft')) right -= 1;    // A = left
      if (keys.has(' ')) up += 1;                                 // Space = ascend
      if (keys.has('c') || keys.has('control')) up -= 1;         // C/Ctrl = descend

      setMoveDirection({ forward, right, up });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys.add(key);

      // Boost on shift
      if (e.shiftKey) setBoosting(true);

      // ESC cancels hyperdrive
      if (e.key === 'Escape' && hyperdrive.phase !== 'idle') {
        cancelHyperdrive();
        return;
      }

      // H key toggles HUD
      if (key === 'h') {
        e.preventDefault();
        toggleHUD();
        return;
      }

      // J/K for node cycling (vim-style)
      if (key === 'j') {
        e.preventDefault();
        focusNextNode();
        return;
      }
      if (key === 'k') {
        e.preventDefault();
        focusPrevNode();
        return;
      }

      // Enter to navigate to selected node (keyboard fallback)
      if (e.key === 'Enter' && selectedNodeId && hyperdrive.phase === 'idle') {
        window.location.href = `/world/${selectedNodeId}`;
        return;
      }

      updateMovement();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
      if (!e.shiftKey) setBoosting(false);
      updateMovement();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setMoveDirection, setBoosting, hyperdrive.phase, cancelHyperdrive, focusNextNode, focusPrevNode, selectedNodeId, toggleHUD]);

  return null;
}
