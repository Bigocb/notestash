import AppShell from "@/components/layout/AppShell";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useFileWatcher } from "@/hooks/useFileWatcher";

function App() {
  useKeyboardShortcuts();
  useFileWatcher();
  return <AppShell />;
}

export default App;
