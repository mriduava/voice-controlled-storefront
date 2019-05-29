import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { StoryblokService } from '../storyblok.service';



export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})



export class ShowComponent implements OnInit {

  product: any = [];

  textArr = [];
  ngZone: any;

  constructor(private route: ActivatedRoute, private showItem: StoryblokService, private router: Router, private zone: NgZone) { }
 
  // cntToPro: any;
  

  ngOnInit() {
    const productId = this.route.snapshot.params.id;
    this.showItem.getStory(productId, {version: 'draft'})
    .then(data => {
      console.log(data.story);
      this.product = data.story.content;

      this.textArr.push(`${this.product.title} has been selected, It's price ${this.product.price} SEK ... `);
      console.log(this.textArr);
    });

      // TEXT TO SPEECH
    const sayText = () => {
        const textSpeech = () => {
          const speaks = [{name: 'Alex', lang: 'en-US'}];
          const msg = new SpeechSynthesisUtterance();
          msg.volume = 1;
          msg.rate = 1;
          msg.pitch = 1.5;
          msg.text  = `${this.textArr}`;
          const voice = speaks[0];
          msg.lang = voice.lang;
          speechSynthesis.speak(msg);
        };
        setTimeout(textSpeech, 3000);
      };
    sayText();

    
    const goToPro = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
      speechSynthesis.cancel();
    }

    const goToCart = () => {
      this.zone.run(() => this.router.navigateByUrl('/cart'))
      speechSynthesis.cancel();
    }

    // SPEECH TO TEXT    

    const {webkitSpeechRecognition} : IWindow = <IWindow>window;
    const recognition = new webkitSpeechRecognition();
    // var SpeechRecognition = window['SpeechRecognition'] || Window['webkitSpeechRecognition'];
    // var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList ||window['webkitSpeechGrammarList'];
    
    var grammar = '#JSGF V1.0;'
    // var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    // recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = function(event) {
        let last = event.results.length - 1;
        let command = event.results[last][0].transcript;
        
        console.log(command);
    
        if(command.toLowerCase() === 'continue'){          
          console.log('I am listening');
          goToPro();
        }else if(command.toLowerCase() === 'bye'){  
          goToCart();
        }
      

    };
    recognition.onspeechend = function() {
        recognition.stop();
    };
    recognition.onerror = function(event) {
      console.log(event.error);
    }        
    document.querySelector('#speak').addEventListener('click', function(){
        recognition.start();
    });


  }

}


