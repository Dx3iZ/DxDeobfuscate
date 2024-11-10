
window.addEventListener('load', function () {
    const clipboard = FlowbiteInstances.getInstance('CopyClipboard', 'code-block');

    const $defaultMessage = document.getElementById('default-message');
    const $successMessage = document.getElementById('success-message');

    clipboard.updateOnCopyCallback((clipboard) => {
        showSuccess();

        setTimeout(() => {
            resetToDefault();
        }, 2000);
    })

    const showSuccess = () => {
        $defaultMessage.classList.add('hidden');
        $successMessage.classList.remove('hidden');
    }

    const resetToDefault = () => {
        $defaultMessage.classList.remove('hidden');
        $successMessage.classList.add('hidden');
    }
})

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark')
}

document.getElementById('process-btn').addEventListener('click', async (event) => {
    event.preventDefault();

    const code = document.getElementById("input-code").value;
    const response = await fetch('/process_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `code=${encodeURIComponent(code)}`
    });

    const data = await response.json();
    if (data.result == "zlibError") {
        document.getElementById("code-block").innerHTML =
        '<div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">\n<div>\n<span class="font-medium">An error occurred during the decryption process:</span>\n<ul class="mt-1.5 list-disc list-inside">\n<li>Error while decompressing data: incomplete or truncated stream</li>\n<li>Error while decompressing data: incorrect header check</li>\n<li>Writing that does not comply with Base64 rules</li>\n</ul>\n</div>\n</div>';
    } else {
        document.getElementById("code-block").innerText = data.result;
    }
});
