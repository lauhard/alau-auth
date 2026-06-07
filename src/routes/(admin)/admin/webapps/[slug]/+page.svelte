<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import type { Webapp } from "$lib/types/webapp";
    import { untrack } from "svelte";
    import { updateWebapp, deactivateWebapp } from "../webapps.remote";

    let { data }: { data: { webapp: Webapp } } = $props();

    // Edit state
    let editing = $state(false);
    let submitting = $state(false);
    let errors = $state<Record<string, string>>({});

    // svelte-ignore state_referenced_locally
    let name = $state("");
    let domain = $state("");
    let authBasePath = $state("");
    let callbackUrl = $derived(`https://${domain}${authBasePath}/callback`);

    const startEditing = () => {
        // untrack: liest data.webapp einmalig ohne reaktive Abhängigkeit zu erzeugen
        untrack(() => {
            name = data.webapp.name;
            domain = data.webapp.domain;
            authBasePath = data.webapp.authBasePath;
            callbackUrl = data.webapp.callbackUrl;
        });
        editing = true;
    };

    const saveChanges = async (e: Event) => {
        e.preventDefault();
        submitting = true;
        errors = {};
        try {
            await updateWebapp({
                id: data.webapp.id,
                name,
                domain,
                authBasePath,
                callbackUrl,
            });
            await invalidateAll(); // Refetch data for this page
            editing = false;
        } catch (e) {
            errors.form = e instanceof Error ? e.message : "Unbekannter Fehler";
        } finally {
            submitting = false;
        }
    };

    
</script>

{#if !editing}
    <header>
        <a href="/admin/webapps">← Zurück</a>
        <h1>{data.webapp.name}</h1>
        <span>{data.webapp.isActive ? "Aktiv" : "Inaktiv"}</span>
    </header>

    <dl>
        <dt>Slug</dt>
        <dd><code>{data.webapp.slug}</code></dd>
        <dt>Domain</dt>
        <dd>{data.webapp.domain}</dd>
        <dt>Auth Base Path</dt>
        <dd><code>{data.webapp.authBasePath}</code></dd>
        <dt>Callback URL</dt>
        <dd>{data.webapp.callbackUrl}</dd>
        <dt>Erstellt</dt>
        <dd>{new Date(data.webapp.createdAt).toLocaleString("de-AT")}</dd>
    </dl>

    <button onclick={startEditing}>Bearbeiten</button>
    <button
        onclick={async () => {
            await deactivateWebapp({ id: data.webapp.id });
            goto("/admin/webapps");
        }}>Deaktivieren</button
    >
{:else}
    <form
        onsubmit={async (e) => {
            await saveChanges(e);
        }}
    >
        {#if errors.form}<p class="error">{errors.form}</p>{/if}

        <label>Name<input type="text" bind:value={name} required /></label>
        <label>Domain<input type="text" bind:value={domain} /></label>
        <label
            >Auth Base Path<input
                type="text"
                bind:value={authBasePath}
            /></label
        >
        <label
            >Callback URL<input
                type="url"
                readonly
                bind:value={callbackUrl}
            /></label
        >

        <button type="submit" disabled={submitting}>
            {submitting ? "Speichert..." : "Speichern"}
        </button>
        <button type="button" onclick={() => (editing = false)}
            >Abbrechen</button
        >
    </form>
{/if}
