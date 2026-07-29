import PortSweepWidget from './PortSweepWidget';
import AuthHeadersWidget from './AuthHeadersWidget';
import CaesarDecryptWidget from './CaesarDecryptWidget';
import ChmodWidget from './ChmodWidget';
import CiaTriadWidget from './CiaTriadWidget';
import LogInspectorWidget from './LogInspectorWidget';
import SqliSanitizeWidget from './SqliSanitizeWidget';
import HashVerifierWidget from './HashVerifierWidget';

// Import new NetOps widgets
import FirewallRuleBuilderWidget from './FirewallRuleBuilderWidget';
import DnsRoutingConfigWidget from './DnsRoutingConfigWidget';
import PacketCaptureViewerWidget from './PacketCaptureViewerWidget';
import VlanSegmentationWidget from './VlanSegmentationWidget';

export const widgetRegistry = {
  'port-sweep': PortSweepWidget,
  'auth-headers': AuthHeadersWidget,
  'caesar-decrypt': CaesarDecryptWidget,
  'chmod': ChmodWidget,
  'cia-triad': CiaTriadWidget,
  'log-inspector': LogInspectorWidget,
  'sqli-sanitize': SqliSanitizeWidget,
  'hash-verifier': HashVerifierWidget,
  
  // NetOps widgets
  'firewall-rule-builder': FirewallRuleBuilderWidget,
  'dns-routing-config': DnsRoutingConfigWidget,
  'packet-capture-viewer': PacketCaptureViewerWidget,
  'vlan-segmentation': VlanSegmentationWidget
};
