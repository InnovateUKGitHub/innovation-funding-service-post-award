import argparse
from lxml import etree
from pprint import pprint

out = 'owasp-zap/logs/report.xml'
high = 0

# read results from xml
site = etree.parse(out)
alertitems = site.xpath('/OWASPZAPReport/site/alerts/alertitem')
if len(alertitems) > 0:
    print "%s security alerts have been found:" % len(alertitems)
    # print alerts found
    for alert in alertitems:
        print "%s: %s (%s)" % (alert.find('riskdesc').text, alert.find('alert').text, alert.find('desc').text)
        if "High" in alert.find('riskdesc').text:
            high += 1
    # return >0 with list of failures, if High prio is present
    if high >= 3:
        exit(1)
    else:
        # return 0 when no failures
        exit(0)
