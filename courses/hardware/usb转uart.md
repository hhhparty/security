# 串口访问硬件


```

Format: Log Type - Time(microsec) - Message - Optional Info
Log Type: B - Since Boot(Power On Reset),  D - Delta,  S - Statistic
S - QC_IMAGE_VERSION_STRING=BOOT.BF.3.1.2-00084
S - IMAGE_VARIANT_STRING=LAATANAZA
S - OEM_IMAGE_VERSION_STRING=HF-SW-JARED
S - Boot Config, 0x000002e1
B -      1216 - PBL, Start
B -      3723 - bootable_media_detect_entry, Start
B -      4403 - bootable_media_detect_success, Start
B -      4407 - elf_loader_entry, Start
B -      7859 - auth_hash_seg_entry, Start
B -      8080 - auth_hash_seg_exit, Start
B -     54552 - elf_segs_hash_verify_entry, Start
B -     97892 - PBL, End
B -     90768 - SBL1, Start
B -    140574 - pm_device_init, Start
B -    157837 - PM_SET_VAL:Skip
D -     15921 - pm_device_init, Delta
B -    158844 - boot_config_data_table_init, Start
D -    174917 - boot_config_data_table_init, Delta - (420 Bytes)
B -    337299 - CDT version:3,Platform ID:8,Major ID:1,Minor ID:0,Subtype:0
B -    343460 - sbl1_ddr_set_params, Start
B -    347303 - Pre_DDR_clock_init, Start
D -       213 - Pre_DDR_clock_init, Delta
D -         0 - sbl1_ddr_set_params, Delta
B -    359991 - pm_driver_init, Start
D -      4514 - pm_driver_init, Delta
B -    366335 - cpr_init, Start
D -        91 - cpr_init, Delta
B -    370910 - cpr_cx_mx_apc_vol_update, Start
D -        61 - cpr_cx_mx_apc_vol_update, Delta
B -    385520 - sbl1_qhsusb_al_do_fast_enum, Start
D -         0 - sbl1_qhsusb_al_do_fast_enum, Delta
B -    388661 - clock_init, Start
D -       152 - clock_init, Delta
B -    394456 - boot_flash_init, Start
D -     37393 - boot_flash_init, Delta
B -    436028 - Image Load, Start
B -    436058 - [QUEC_SECBOOT]Image Type = 1
B -    442646 - [QUEC_SECBOOT]Image Auth Enable Sate = 1
B -    450058 - [QUEC_SECBOOT]Image Auth Result Sate = 0
D -     66520 - QSEE Image Loaded, Delta - (490652 Bytes)
D -       183 - boot_pm_post_tz_device_init, Delta
B -    506971 - sbl1_efs_handle_cookies, Start
D -         0 - sbl1_efs_handle_cookies, Delta
B -    514260 - Devcfg Partition does not exist
B -    518530 - Image Load, Start
D -        30 - SEC Image Loaded, Delta - (0 Bytes)
B -    526125 - Image Load, Start
B -    529144 - [QUEC_SECBOOT]Image Type = 1
B -    536159 - [QUEC_SECBOOT]Image Auth Enable Sate = 1
B -    543540 - [QUEC_SECBOOT]Image Auth Result Sate = 0
D -     32757 - RPM Image Loaded, Delta - (152784 Bytes)
B -    558943 - Image Load, Start
B -    560590 - [QUEC_SECBOOT]Image Type = 1
B -    567696 - [QUEC_SECBOOT]Image Auth Enable Sate = 1
B -    575047 - [QUEC_SECBOOT]Image Auth Result Sate = 0
D -     52796 - APPSBL Image Loaded, Delta - (380236 Bytes)
B -    611769 - QSEE Execution, Start
D -       213 - QSEE Execution, Delta
B -    617442 - SBL1, End
D -    529053 - SBL1, Delta
S - Throughput, 3000 KB/s  (1024092 Bytes,  287518 us)
S - DDR Frequency, 240 MHz
Android Bootloader - UART_DM Initialized!!!
[0] welcome to lk

[0] SCM call: 0x2000601 failed with :fffffffc
[0] Failed to initialize SCM
[10] platform_init()
[10] target_init()
[10] 111 flash->id=0x2690ac98,supported_flash[0]=0x1590ac2c, flash->id2=0x81676, supported_flash_id2=0x56[20] 111 flash->id=0x2690ac98,supported_flash[1]=0x1590ac01, flash->id2=0x81676, supported_flash_id2=0x56[30] 111 flash->id=0x2690ac98,supported_flash[2]=0x1590ac2c, flash->id2=0x81676, supported_flash_id2=0x57[30] 111 flash->id=0x2690ac98,supported_flash[3]=0x1590aa2c, flash->id2=0x81676, supported_flash_id2=0x6[40] 111 flash->id=0x2690ac98,supported_flash[4]=0x2690ac2c, flash->id2=0x81676, supported_flash_id2=0x54[50] 111 flash->id=0x2690ac98,supported_flash[5]=0x1590acad, flash->id2=0x81676, supported_flash_id2=0x0[60] 111 flash->id=0x2690ac98,supported_flash[6]=0x9590dc2c, flash->id2=0x81676, supported_flash_id2=0x56[70] 111 flash->id=0x2690ac98,supported_flash[7]=0x1590aa98, flash->id2=0x81676, supported_flash_id2=0x76[80] 111 flash->id=0x2690ac98,supported_flash[8]=0x2690a32c, flash->id2=0x81676, supported_flash_id2=0x64[90] 111 flash->id=0x2690ac98,supported_flash[9]=0x2690ac98, flash->id2=0x81676, supported_flash_id2=0x81676[100] smem ptable found: ver: 4 len: 20
[100] ERROR: No devinfo partition found
[110] Neither 'config' nor 'frp' partition found
[110] [Ramos] get fastboot message start !!!
[110] [Ramos] get fastboot message end !!!
CTRL+C: enter instruction mode
RECOVERY,PINTEST OR FASTBOOT



aboot_init char: 
aboot_init char: 
aboot_init char: 
aboot_init char: 
aboot_init char: 
aboot_init char: 
aboot_init char: 
aboot_init char: 
aboot_init char: 
aboot_init char: 
[230] @Ramos Read flag qpic_nand_read_page =0x1f40, 
[240] @Ramos Read flag qpic_nand_read_page result=0, 
[240] flash_read_image: success (0 errors)
[240] @Ramos Ql_check_RestoreFlag:offset=440000, magic1=78e5d4c2,magic2=54f7d60e,linuxfs_restoreFlag=0, cefs_restoreFlag=0, modem_restoreFlag=0,recoveryfs_restoreFlag=0 image_restoring_flag=0 
[260] @Ramos linuxfs_restore_times=0, cefs_restore_times=0, modem_restore_times=0
[270] @Ramos Read flag qpic_nand_read_page =0x1e80, 
[270] @Ramos Read flag qpic_nand_read_page result=0, 
[280] flash_read_image: success (0 errors)
[280] @Ramos check AllRestoring flag =-1,fota_updateRecoveryImgFlag=-1
[290] fota info check to recovery
[290] flash_read_image: failed (0 errors)
[290] ERROR: Cannot read fota info_back
[300] type:0 state:0 fcount:0
[300] AAAAALoading (boot) image (5767168): start
[870] AAAAALoading (boot) image (5767168): done
[880] Authenticating boot image (5767168): start
[940] Authenticating boot image: done return value = 1
[1000] DTB Total entry: 4, DTB version: 3
[1000] Using DTB entry 0x00000122/00010000/0x00000008/0 for device 0x00000122/00010000/0x00010008/0
[1010] cmdline: noinitrd  rw console=ttyHSL0,115200,n8 androidboot.hardware=qcom ehci-hcd.park=3 msm_rtb.filter=0x37 lpm_levels.sleep_disabled=1  earlycon=msm_hsl_uart,0x78b3000  androidboot.serialno=43d5bdd0 androidboot.authorized_kernel=true androidboot.baseba[1030] Updating device tree: start
[1160] Updating device tree: done
[1160] booting linux @ 0x80008000, ramdisk @ 0x80008000 (0), tags/device tree @ 0x81e00000
INIT: Entering runlevel: 5
Configuring network interfaces... Error: argument "eth0" is wrong: Unknown device
chown: /sdcard: No such file or directory
hwclock: settimeofday: Invalid argument
Starting syslogd done
Starting tftp_server: /sbin/tftp_server is already running
440
Starting irsc_util: Starting irsc tool
Failed to open file:/etc/sec_config
Absent/Invalid config,Default rules apply
Ending irsc tool
done
Starting modem dependent daemons: Starting/Loading embms_kernel module: done loading embms_kernel module
Starting qmuxd: done
Starting thermal-engine: done
Starting qllog: done
>>> Starting QuecOpen application: done
Starting netmgrd: star.sh
after system startup ,start the application list below.
......................................................
done
Starting qmi_shutdown_modem: done
Starting quectel_daemon: done
Starting quectel-smd-atcmd: done
[01/Jan/1970:00:00:13 +0000] boa: server version Boa/0.94.13
[01/Jan/1970:00:00:13 +0000] boa: server built Sep 26 2018 at 07:09:43.
[01/Jan/1970:00:00:13 +0000] boa: starting server pid=615, port 8000
Starting quectel_daemon: done
Starting quectel_psm_aware: done
Starting quectel-remotefs-service done
Starting quectel-tts-service done
Starting Lighttpd Web Server: self-signing certificates already exist for webserver: QL Lpm Init, ret: 0
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
success:VTOP_CreateRelTimer
start_tick_and_timer_check()
OpenLinux: thread example 
Main process: PID: 561, TID: 3067461632

2022-06-30 21:47:10: (/home/eve/Eve_Linux_Server/Qualcomm/MDM9x07/OpenLinux/LE.1.0.c3/Release/EC20CEFAG/R06A05/apps_proc/oe-core/build/tmp-glibc/work/armv7a-vfp-neon-oe-linux-gnueabi/lighttpd/1.4.35-r1/lighttpd-1.4.35/src/log.c.164) server started 
lighttpd.
Starting MCM RIL Services: done
Starting eMBMs_TunnelingModule: done
Starting MCM RIL Services: mcm_ril_service is already running
980
Starting qmi_ip: done
Starting subsystem_ramdump: done
Starting wlan_services... start
Setting restart level: system
done
+ set -e
+ echo -n Starting quectel-gps-handle(uart-ddp): 
Starting quectel-gps-handle(uart-ddp): + echo cp quectel-uart-ddp quectel-gps-handle done
cp quectel-uart-ddp quectel-gps-handle done
+ start-stop-daemon -S -b -a /usr/bin/quectel-gps-handle -- -default
+ echo done
done
+ exit 0
Starting/Loading Shortcut_FE Driver: done loading Shortcut FE driver
Starting system message bus: dbus.
Starting modem dependent daemons: Starting diagrebootapp: done
Starting atreset: done
Starting Lighttpd Web Server: self-signing certificates already exist for webserver: /usr/sbin/lighttpd is already running
968
lighttpd.
Starting qti_ppp: done
done
 * Starting Avahi Unicast DNS Configuration Daemon: avahi-dnsconfd
   ...fail!
S:2345:respawn:/sbin/getty -L ttyHSL0 115200 console
Starting powerconfig for mdm9607: Starting fs-scrub-daemon: /sbin/fs-scrub-daemon is already running
441
Starting pdc daemon: done
Starting ql_manager_server: done

msm 201902281934 mdm9607-perf /dev/ttyHSL0

mdm9607-perf login: Create thread 1, TID: 2988438528
Create thread 3, TID: 2980049920
Create thread 4, TID: 2971661312
Create thread 5, TID: 2963272704
Create thread 7, TID: 2954884096
Create thread 9, TID: 2946495488
Create thread 10, TID: 2938106880
Create thread 11, TID: 2929718272
Create thread 12, TID: 2921329664
Create thread 13, TID: 2912941056
Set connect Request with destination Tserver host...,socket is -1
create socket success
GPS Thread is not started,can't stop!
bind success
listen su3ZXEND!
OTA State is Idle
                 GPS Thread is not started,can't stop!
```