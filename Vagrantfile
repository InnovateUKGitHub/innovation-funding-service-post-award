# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

# Variables for the virtual box instances
memory = '4096'
vcpus  ='2'


if defined? VagrantPlugins::Cachier
    config.cache.scope = :box
    config.cache.auto_detect = true
else
    puts "Yum cache is available (vagrant plugin install vagrant-cachier)."
    puts "It is advised you use this to increase the speed of deployment"
end

    # Config for the Ubuntu based machine
    config.vm.define :osubuntu do |osubuntu|
        osubuntu.vm.hostname = ENV['USER']+"-ubuntu"
        osubuntu.vm.box = "geerlingguy/ubuntu1604"
        osubuntu.vm.network "forwarded_port", guest: 8443, host: 8443
        osubuntu.vm.network "forwarded_port", guest: 8080, host: 5150
        osubuntu.vm.network "forwarded_port", guest: 443, host: 9443
        # Virtualbox specific config
        osubuntu.vm.provider :virtualbox do |vb, override|
          vb.cpus = vcpus
          vb.memory = memory
        end
        # Provisioner installs Vagrant, plugins and other pre-reqs
        config.vm.provision "shell",
          path: "provision.sh",
          privileged: true
    end

    # Config for the Redhat (Centos) based machine
    config.vm.define :osrhel do |osrhel|
        osrhel.vm.hostname = ENV['USER']+"-rhel"
        osrhel.vm.box = "geerlingguy/centos7"
        osrhel.vm.network "forwarded_port", guest: 8443, host: 8443
        osrhel.vm.network "forwarded_port", guest: 8080, host: 5150
        osrhel.vm.network "forwarded_port", guest: 443, host: 9443
        osrhel.vm.provider "virtualbox"
        # Provisioner installs Vagrant, plugins and other pre-reqs
        osrhel.vm.provision "shell",
            path: "provision.sh",
            privileged: true
        osrhel.vm.provider :virtualbox do |vb, override|
           vb.cpus = vcpus
           vb.memory = memory
        end
    end

end