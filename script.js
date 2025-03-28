(function() {
    var infoImmediate, infoPreBackoff, infoBackoff, infoPostBackoff;
    var numRetries, numNoDelayRetries, minDelayTarget, maxDelayTarget, numMinDelayRetries, numMaxDelayRetries, backoffFunction;
    var policy;


    /**
     * Pre-lookup all of the form fields, attach events
     */
    function init()
    {
        infoImmediate = document.getElementById('infoImmediate');
        infoPreBackoff = document.getElementById('infoPreBackoff');
        infoBackoff = document.getElementById('infoBackoff');
        infoPostBackoff = document.getElementById('infoPostBackoff');
        numRetries = document.getElementById('numRetries');
        numNoDelayRetries = document.getElementById('numNoDelayRetries');
        minDelayTarget = document.getElementById('minDelayTarget');
        maxDelayTarget = document.getElementById('maxDelayTarget');
        numMinDelayRetries = document.getElementById('numMinDelayRetries');
        numMaxDelayRetries = document.getElementById('numMaxDelayRetries');
        backoffFunction = document.getElementById('backoffFunction');
        policy = document.getElementById('policy');

        numRetries.addEventListener('input', calculate);
        numNoDelayRetries.addEventListener('input', calculate);
        minDelayTarget.addEventListener('input', calculate);
        maxDelayTarget.addEventListener('input', calculate);
        numMinDelayRetries.addEventListener('input', calculate);
        numMaxDelayRetries.addEventListener('input', calculate);
        backoffFunction.addEventListener('input', calculate);
    }


    /**
     * Calculate the visualisation for a given policy
     */
    function calculate()
    {
        infoImmediate.innerText = numNoDelayRetries.value + ' retries';

        // Pre-backoff
        infoPreBackoff.innerText = numMinDelayRetries.value + ' retries';
        if (numMinDelayRetries.value > 0) {
            infoPreBackoff.innerHTML += ' every ' + secsToTime(minDelayTarget.value);
            infoPreBackoff.innerHTML += '<br>';
            infoPreBackoff.innerHTML += 'Total: ' + secsToTime(numMinDelayRetries.value + minDelayTarget.value);
        }

        // Post-backoff
        infoPostBackoff.innerText = numMaxDelayRetries.value + ' retries';
        if (numMaxDelayRetries.value > 0) {
            infoPostBackoff.innerHTML += ' every ' + secsToTime(maxDelayTarget.value);
            infoPostBackoff.innerHTML += '<br>';
            infoPostBackoff.innerHTML += 'Total: ' + secsToTime(numMaxDelayRetries.value + maxDelayTarget.value);
        }

        // Backoff phase
        var backoffSends = parseInt(numRetries.value, 10) - parseInt(numNoDelayRetries.value, 10)
            - parseInt(numMinDelayRetries.value, 10) - parseInt(numMaxDelayRetries.value, 10);
        var backoffAvgDelay = ((maxDelayTarget.value - minDelayTarget.value) / 2) + parseInt(minDelayTarget.value, 10);
        infoBackoff.innerText = backoffSends + ' retries';
        if (backoffSends > 0) {
            infoBackoff.innerHTML += ' between ' + secsToTime(minDelayTarget.value);
            infoBackoff.innerHTML += ' and ' + secsToTime(maxDelayTarget.value);
            infoBackoff.innerHTML += '<br>';
            infoBackoff.innerHTML += 'Total: ~ ' + secsToTime(backoffSends * backoffAvgDelay);
        }

        // Generate the policy from the field values
        var policyJson = {
            "numRetries": parseInt(numRetries.value, 10),
            "numNoDelayRetries": parseInt(numNoDelayRetries.value, 10),
            "minDelayTarget": parseInt(minDelayTarget.value, 10),
            "maxDelayTarget": parseInt(maxDelayTarget.value, 10),
            "numMinDelayRetries": parseInt(numMinDelayRetries.value, 10),
            "numMaxDelayRetries": parseInt(numMaxDelayRetries.value, 10),
            "backoffFunction": backoffFunction.value
        };
        policy.innerText = JSON.stringify(policyJson, null, 4);
    }


    /**
     * Convert a time in seconds into something more suitable for display
     */
    function secsToTime(secs)
    {
        secs = parseInt(secs, 10)
        if (secs < 300) {
            return secs + ' seconds';
        } else {
            return Math.round(secs / 60) + ' minutes';
        }
    }


    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('DOMContentLoaded', calculate);
})();
