<script lang="ts">
    import { redirect } from "@sveltejs/kit";
    import { loginWithPassword } from "./login.remote";
    import { goto } from "$app/navigation";



    let email = $state('');
    let password = $state('');
    let error = $state<string | null>(null);

    async function handleSubmit() {
        const result = await loginWithPassword({ email, password });
        if (result && !result.success) {
            error = result.error;
        }
        else{
            goto("/admin/webapps");
        }
    }
</script>

<div class="login">
    <h1>Login</h1>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    <input type="email" bind:value={email} placeholder="Email" />
    <input type="password" bind:value={password} placeholder="Passwort" />
    <button onclick={handleSubmit}>Einloggen</button>
</div>