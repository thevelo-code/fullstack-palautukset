const Notification = ({ message, type }) => {
  console.log('Notification props:', message, type)
  if (message === null) {
    return null
  }
  return (
    <div className={type}>
      {message}
    </div>
  )
}

export default Notification

