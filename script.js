(function() {
    var infoImmediateEl, infoPreBackoffEl, infoBackoffEl, infoPostBackoffEl;
    var numRetriesEl, numNoDelayRetriesEl, minDelayTargetEl, maxDelayTargetEl, numMinDelayRetriesEl, numMaxDelayRetriesEl, backoffFunctionEl;
    var policyEl;


    /**
     * Pre-lookup all of the form fields, attach events
     */
    function init()
    {
        infoImmediateEl = document.getElementById('infoImmediate');
        infoPreBackoffEl = document.getElementById('infoPreBackoff');
        infoBackoffEl = document.getElementById('infoBackoff');
        infoPostBackoffEl = document.getElementById('infoPostBackoff');
        numRetriesEl = document.getElementById('numRetries');
        numNoDelayRetriesEl = document.getElementById('numNoDelayRetries');
        minDelayTargetEl = document.getElementById('minDelayTarget');
        maxDelayTargetEl = document.getElementById('maxDelayTarget');
        numMinDelayRetriesEl = document.getElementById('numMinDelayRetries');
        numMaxDelayRetriesEl = document.getElementById('numMaxDelayRetries');
        backoffFunctionEl = document.getElementById('backoffFunction');
        policyEl = document.getElementById('policy');

        numRetriesEl.addEventListener('input', calculate);
        numNoDelayRetriesEl.addEventListener('input', calculate);
        minDelayTargetEl.addEventListener('input', calculate);
        maxDelayTargetEl.addEventListener('input', calculate);
        numMinDelayRetriesEl.addEventListener('input', calculate);
        numMaxDelayRetriesEl.addEventListener('input', calculate);
        backoffFunctionEl.addEventListener('input', calculate);
    }


    /**
     * Calculate the visualisation for a given policy
     */
    function calculate()
    {
        let numRetries = parseInt(numRetriesEl.value, 10);
        let numNoDelayRetries = parseInt(numNoDelayRetriesEl.value, 10);
        let minDelayTarget = parseInt(minDelayTargetEl.value, 10);
        let maxDelayTarget = parseInt(maxDelayTargetEl.value, 10);
        let numMinDelayRetries = parseInt(numMinDelayRetriesEl.value, 10);
        let numMaxDelayRetries = parseInt(numMaxDelayRetriesEl.value, 10);

        infoImmediateEl.innerHTML = numNoDelayRetries + ' retries';

        // Pre-backoff
        infoPreBackoffEl.innerHTML = numMinDelayRetries + ' retries';
        if (numMinDelayRetries > 0) {
            infoPreBackoffEl.innerHTML += ' every ' + secsToTime(minDelayTarget);
            infoPreBackoffEl.innerHTML += '<br>';
            infoPreBackoffEl.innerHTML += 'Total: ' + secsToTime(numMinDelayRetries * minDelayTarget);
        }

        // Post-backoff
        infoPostBackoffEl.innerHTML = numMaxDelayRetries + ' retries';
        if (numMaxDelayRetries > 0) {
            infoPostBackoffEl.innerHTML += ' every ' + secsToTime(maxDelayTarget);
            infoPostBackoffEl.innerHTML += '<br>';
            infoPostBackoffEl.innerHTML += 'Total: ' + secsToTime(numMaxDelayRetries * maxDelayTarget);
        }

        // Backoff phase
        var backoffSends = numRetries - numNoDelayRetries - numMinDelayRetries - numMaxDelayRetries;
        var backoffAvgDelay = ((maxDelayTarget - minDelayTarget) / 2) + minDelayTarget;
        infoBackoffEl.innerHTML = backoffSends + ' retries';
        if (backoffSends > 0) {
            infoBackoffEl.innerHTML += ' between ' + secsToTime(minDelayTarget);
            infoBackoffEl.innerHTML += ' and ' + secsToTime(maxDelayTarget);
            infoBackoffEl.innerHTML += '<br>';
            infoBackoffEl.innerHTML += 'Total: ~ ' + secsToTime(backoffSends * backoffAvgDelay);
        }

        // Generate the policy from the field values
        var policyJson = {
            "numRetries": numRetries,
            "numNoDelayRetries": numNoDelayRetries,
            "minDelayTarget": minDelayTarget,
            "maxDelayTarget": maxDelayTarget,
            "numMinDelayRetries": numMinDelayRetries,
            "numMaxDelayRetries": numMaxDelayRetries,
            "backoffFunction": backoffFunctionEl.value
        };
        policyEl.innerText = JSON.stringify(policyJson, null, 4);
    }


    /**
     * Convert a time in seconds into something more suitable for display
     */
    function secsToTime(secs)
    {
        if (secs < 300) {
            return secs + ' seconds';
        } else if (secs < 7200) {
            return Math.round(secs / 60) + ' minutes';
        } else {
            return Math.round(secs / 60 / 60) + ' hours';
        }
    }


    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('DOMContentLoaded', calculate);
})();
