<!-- src/routes/(admin)/admin/webapps/new/+page.svelte -->
<script lang="ts">
    import { createWebapp } from '../webapps.remote';
    import { goto } from '$app/navigation';
    import { generateSlug } from '$lib/utils/string';

    // Form state
    let name = $state('');
    let slug = $state('');
    let domain = $state('');
    let authBasePath = $state('/auth');
    let callbackUrl = $derived(`https://${domain}${authBasePath}/callback`);
    let slugTouched = $state(false);
    let errors = $state<Record<string, string>>({});
    let submitting = $state(false);

    // Auto-generate slug from name until user manually edits it
    $effect(() => {
        if (!slugTouched && name) {
            slug = generateSlug(name);
        }
    });

    async function handleSubmit() {
        submitting = true;
        errors = {};
        try {
            const webapp = await createWebapp({
                name,
                slug,
                domain,
                authBasePath,
                callbackUrl,
            });
            goto(`/admin/webapps/${webapp?.slug}`);
        } catch (e) {
            errors.form = e instanceof Error ? e.message : 'Unbekannter Fehler';
        } finally {
            submitting = false;
        }
    }
</script>

<div class="page">
    <header>
        <a href="/admin/webapps">← Zurück</a>
        <h1>Neue Webapp</h1>
    </header>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {#if errors.form}
            <p class="error">{errors.form}</p>
        {/if}

        <label>
            Name
            <input
                type="text"
                bind:value={name}
                placeholder="My App"
                required
            />
        </label>

        <label>
            Slug
            <input
                type="text"
                bind:value={slug}
                oninput={() => slugTouched = true}
                placeholder="my-app"
                required
            />
            <small>URL-sicherer Identifier, z.B. my-app</small>
        </label>

        <label>
            Domain
            <input
                type="text"
                bind:value={domain}
                placeholder="www.example.com"
                required
            />
        </label>

        <label>
            Auth Base Path
            <input
                type="text"
                bind:value={authBasePath}
                placeholder="/auth"
            />
        </label>

        <label>
            Callback URL
            <input
                type="url"
                readonly
                bind:value={callbackUrl}
                placeholder="https://www.example.com/auth/callback"
                required
            />
        </label>

        <button type="submit" disabled={submitting}>
            {submitting ? 'Wird erstellt...' : 'Webapp erstellen'}
        </button>
    </form>
</div>