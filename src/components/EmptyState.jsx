function EmptyState({ icon = "📭", message = "No data found" }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
