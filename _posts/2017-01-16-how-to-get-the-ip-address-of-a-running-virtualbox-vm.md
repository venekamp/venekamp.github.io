---
layout: post
title: How to get the IP address of a running VirtualBox VM
date: 2017-01-16 13:25:06 +0100
tags:
    - VirtualBox
---

# Getting the IP address from a running instance
If you have a VirtualBox VM running and want to know its IP address,
then execute the below command:

``` shell
VBoxManage guestproperty get <machine name> "/VirtualBox/GuestInfo/Net/0/V4/IP" | awk '{ print $2 }'
```

Please substitude `<machine name>` with the appropriate name of you VM,
or its UUID.
