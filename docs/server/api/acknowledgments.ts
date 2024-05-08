export default defineCachedEventHandler(async () => {
  const res = await fetch('https://app.fossa.com/attribution/149f340b-96c9-4c37-acc0-e664766ec26d', {
    redirect: 'follow'
  })

  return new Response(await res.arrayBuffer(), {
    status: res.status,
    statusText: res.statusText,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}, {
  swr: true,
  maxAge: 60 * 60 * 24
})
