<!-- src/routes/(admin)/admin/webapps/+page.svelte -->
<script>
  import { listWebapps, deactivateWebapp } from "./webapps.remote";
</script>

<a href="/admin/webapps/new">+ Neue Webapp</a>

<svelte:boundary>
  {#await listWebapps()}
    <p>Lade Webapps...</p>
  {:then webapps}
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Slug</th>
          <th>Domain</th>
          <th>Status</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {#each webapps as app}
          <tr>
            <td><a href="/admin/webapps/{app.slug}">{app.name}</a></td>
            <td><code>{app.slug}</code></td>
            <td>{app.domain}</td>
            <td>{app.isActive ? "Aktiv" : "Inaktiv"}</td>
            <td>
              <button onclick={() => deactivateWebapp({ id: app.id })}>
                Deaktivieren
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/await}
  {#snippet failed(error, reset)}
    <p>
      Fehler: {error instanceof Error ? error.message : "Unbekannter Fehler"}
    </p>
    <button onclick={reset}>Erneut versuchen</button>
  {/snippet}
</svelte:boundary>
