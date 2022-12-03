import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/models/settings-model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  //keep track of last meeting threshold
  //keep track of birthday threshold
  //keep track of anniversary threshold
  //email alerts? (Daily, weekly?)

  settings: Settings;
  settingsForm: FormGroup;
  editMode: boolean = false;
  initalValues = null;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.isLoading = true;
    this.settingsService.getAppSettings();
    this.settingsService.settings.subscribe((settings: Settings) => {
      this.settings = settings;
      this.initForm();
      this.initalValues = this.settingsForm.value;
      this.isLoading = false;
    });
  }

  private initForm(): void {
    let lastInteractionThreshold = 0;
    let birthdateThreshold = 0;
    let workAnniversaryThreshold = 0;
    let dailyDigest = false;
    let weeklyDigest = false;

    if (Object.keys(this.settings)) {
      lastInteractionThreshold = this.settings.lastInteractionThreshold;
      birthdateThreshold = this.settings.birthdateThreshold;
      workAnniversaryThreshold = this.settings.workAnniversaryThreshold;
      dailyDigest = this.settings.dailyEmailDigest;
      weeklyDigest = this.settings.weeklyEmailDigest;
    }

    this.settingsForm = new FormGroup({
      lastInteractionThreshold: new FormControl(
        lastInteractionThreshold,
        Validators.required
      ),
      birthdateThreshold: new FormControl(
        birthdateThreshold,
        Validators.required
      ),
      workAnniversaryThreshold: new FormControl(
        workAnniversaryThreshold,
        Validators.required
      ),
      dailyDigest: new FormControl(dailyDigest, Validators.required),
      weeklyDigest: new FormControl(weeklyDigest, Validators.required),
    });
  }

  formSubmit() {
    const newSettings = {
      lastInteractionThreshold:
        this.settingsForm.value['lastInteractionThreshold'],
      birthdateThreshold: this.settingsForm.value['birthdateThreshold'],
      workAnniversaryThreshold:
        this.settingsForm.value['workAnniversaryThreshold'],
      dailyEmailDigest: this.settingsForm.value['dailyEmailDigest'],
      weeklyEmailDigest: this.settingsForm.value['weeklyEmailDigest'],
    };

    this.settingsService.updateAppSettings(newSettings);
  }
}
