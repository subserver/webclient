(function(scope) {
    const logger = new MegaLogger({
        name: "MEGAChess"
    });
    const PIECES = Object.freeze({
        ROOK: 'Rook',
        KNIGHT: 'Knight',
        BISHOP: 'Bishop',
        QUEEN: 'Queen',
        KING: 'King',
        PAWN: 'Pawn'
    });
    /** Convert FEN character to piece type **/
    const FENNotation = Object.freeze({
        'r': PIECES.ROOK,
        'n': PIECES.KNIGHT,
        'b': PIECES.BISHOP,
        'q': PIECES.QUEEN,
        'k': PIECES.KING,
        'p': PIECES.PAWN,
        [PIECES.ROOK]: 'r',
        [PIECES.KNIGHT]: 'n',
        [PIECES.BISHOP]: 'b',
        [PIECES.QUEEN]: 'q',
        [PIECES.KING]: 'k',
        [PIECES.PAWN]: 'p',
    });
    /** Sprites **/
    const sprites = {
        blackBishop: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADPklEQVRoge2ZzWsTQRiHn25VDLam1gaN9iLooRdFK6kHkYLgScpC60UEDzl4EhEs3rR+Hjz5DwR6EQ9KhXqVXvyCJLUhIPQgnvRktjW1GF3NrofZNW2SzX5MNouYBwaW7Mw7v3d23vl4A126dPkv6AnZ/iRw1np+DsyF3F8ozAJmXZmNUE8gTtPohF3Gw+hQCcMowhEnzoTRYViOVFq8+x5Sn6EwAvwGDGpTyrB+G4lQVyDuAlVqjlSB25Eq8kkSyLDZiY3OZIC9kanzyCTwFecVyy4rgBqRRlfuURt1N0fsOnciUdqCB9QC2s0Js67u/Qj0NuUiLQSrqmqqqurm1PkIdG8iAZRpMZ0KhYJZKBTcptkKsFtGiOyGeA3Y2cqOoigoSstuFGAXcFVSS2BiiJFsiAtVVc1cLmfm83nTJp/Pm7lczmmaGYAGbAsqRuaLjCNGsh1XgR5gkJAOlG7cxMPqVCwWzWKx6HUluxFUzJbAbnjcnQ3D8GNzTzApco7oXirNzMz4sfkzkBJJLuF98/Na0h31wGI/4ljeLid0IjxMPvYg0Gt51GHtmxgGSvg7YzXbQ0rAPhkh7dgDDgNPR0dHD83PzxOLxTw1qlQqTExMsLi4uAxMAe9lRMisWjZFYE7TtOvZbJa+vj5PjdbX19E0DeAZkk60i1OI6RFkehmIQ+PJjqtuwgLeLlOtTr8vZEXIxshAOp1eHRoakjJSKpXIZDJxYE1STzBSqdQ5XddNWXRdN8fGxqZktEgFezab7U8mk8TjcRkzlMtlNE3bIWVEknHatyEe6az0RqYRKVI7cP0EuYlIoU53XLUDCeAK8Arv6aCXwGWrrTR+V61hq+NBq+12xJUXxG1xADgAHAOOAlvr2v8C3gFLwEdE4mLVelcBfiAcXQG+AJ986nNEAS4ABatTPxtdkHf1pQw8AY7LOBEH3uB/7odRqsBDGr+wK73A64jFNysLOCRMnGIkjkhG2xhOBlz4Bnywng8C/QFs1Pc9SC2u/uK0IZYRh8FbiPV9GXgL5BBBWLbq9SISdDZ2Jr4KfLbqbiSBWDAUxCAObHi3ZrUDMZAJIAWcQPw5tITI3DQ40aVLly7/Hn8ABDVYwUK+TtsAAAAASUVORK5CYII=",
        blackKing: "data:image/png;base64,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",
        blackKnight: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAEjElEQVRoge2ZXWhbZRzGf6khcUnXhjatI9C6UhmRsQqFemH9oCUUhbLqjRXWm9FJb6yDTayj3kwqXuiVrVKLeKNXKxGHXgizd4MWiyhY2BocXlQL6wyk3+1o8nhxctIszefJaSuYB/4kvF95fuc973vO+w9UVFFFFVW0r6rjNlCMXgS+BF7JUvc48AMgYOAoTVnRLxhGE8DbaeWPAT8l6wTcO3prpSnCPkgceD5Zfp19CDNOH4O/onUbA0Bpnz+zD5cOEgauAi8AJ47DbD59xqNm42mROSMC1Nvbq/b29ocul+sm8DrgPA7jmZogh+GMuAeourpaOzs7kqRoNKrJyUmdPXv2b2CIYwQ6DWxz8BbKFnFAHo9HQ0NDmpubk6l4PK6JiQn5fL7fgGeOGuIk8HuREFmjra1N4XA4BXTnzh2dOXNmG3jtKEEmTUOhUEixWEw3btwoZD4r9Pnz5xWNRiVJKysrCgaDceDCUUC0kbxVTp06pfX1dUnS/Px8IZDdXHXBYFBLS0uSpKWlJTU2Nj7EeNgeqmZMA9euXUvdGqOjo5ZmxIxz584pFotJkm7dupWoqqr6C/AdFsSr6T8+NTUlSVpYWJDH47G0VtKjv78/dWEuXbokYOowINzAH6Q9I5qamjQ8PKyampqyIcyYnp5OrZfa2to9IGg3yDt2mc0Xzc3N2trakiSNjIwkgG/shPABMcrYbkuJ8fFxSdLy8rJcLtdDoMEukA+OAsCMlpYWxeNxSVJfX5+A9+yAqAPWKW82Su47MzMjSQqHwwlg0Q6Qj8oAsByDg4OSpI2NDbndbgFPlQNRD2xifTbMflOl9g0EAqmtuKurS8CVQmbznakvAh7A4XA4cDgcxV8CA8IBfAx8XkpHgOXlZe7evQtAd3c37B/acqoQSMLv9xOJRFhcXMTv9xfjw5yJN4F3sfgsmJ2dBaCjowOg08oYAH7TUE9PT2qaQ6FQMbfGKtCTNtZkEX0OxOXLlyVJDx48MMuarYA0mwM6nU6NjY1pbGxMTqez0Hq4DTyZNo4L+AcL66y7uzt1AQOBgICXrYB4yHNkzQjzeHudgye9q6UCmNHa2poC6ezsFPCWFRB4NLmQD2ITCGXp/zSwgcVdz+12p0AGBgYEjOczm2+xf1GgXsnPPow8Vrrqge9J7nr5DOTS7u4uKysrADQ1NQkI5Gufz+jXwIfATo56B8brQyaEByP904pFCFOrq6sANDQ0ADyRr22h3Oz7GC9tzwHPAt8lywV8CnyS0f4k8CPwUimGc2ltbQ0An8/noABIMWmYDWA2+f0Cxu7xK/BnRjsXcBMjCWeLTJC6ujoo8BZcaj5pC/g2S7kD+AroKnG8vEokEgA4nU4wEuM5ZVfa/wqHkP1wu90AeL1eME6pOWUHiI/9xPWhKDkjYKzB7G1s+J2LgNeGcYpRzgtvx4y8gfHQs10ulwuAvb29gm3LBXED7TaMk1UnThj/QGxubhZsW66Bev4jfw2UayJui4scun//Pl6vl0gkYhZt52pb1itEUvVArQ3jFFIU46xTUUUV/Z/1LyfqRUc8MX3kAAAAAElFTkSuQmCC",
        blackPawn: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAB40lEQVRoge2ZOy8EURiGn9msuERcFiFUCiR+gegQ4Q+Ilqh1kv0n/AClWhCJQiNu2YhGiFuBED2NXcVZsdmsmfPNfDNHcZ7kyzTnm/O+Z859wOPxeDweT2q0AavAAVACdoAloMmhJjHjwCNQAcrAV/VZAS6AQXfS7GkH7vkV3iiOgJwrgbas8beB2ljQrli7ZeYwQqOYV65X3UiPRZmKZTkR2kbuLMoEwK1yvepGdjFCo9hTrleVMeAGu8F+CvS7kRlOB3BN+LRbH4f8wwVyHXsDtVF0IfYv+oAP5CbKwBOQ1xChMdjngZYYeQFmuzKpoEHFyEjC/FEFDSpGki5uvQoaVIy8JMx/VtCgYuTMcb4aeeAN2RryM2uVHOgNZZl40++0C7Fh5IBLZEa2nSgNYQCzCfxpZduvUQE2Mdsb5wzzez6PG+ekcD6RUAAekA/yRnECNGeqvkoO08eTGqiNjUwdVFmJKTYqZrM00QW8Y+6rNE18AVdkeEYpKhuoj8UsTAREX8AliTKwn4WRiZQM1HexIakw6aZxRlpBDHLAVJwkCZOYVksblVNjGK+k37XKwLFUmOSL5DEXDWkTkPIY6cTuFlGDgjRBYqRb+vIEtCLce0nulD6BLZGcZPz7n0Eej8cB33ZXXtErnoG6AAAAAElFTkSuQmCC",
        blackQueen: "data:image/png;base64,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",
        blackRook: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACI0lEQVRoge2YvYsTQRiHn02MEYQkTRIwQaLlpYjgBZZrUlhcpWIRC0HOTvwTTJUqva02goUoAbG0TJ1GQ4orPIKQNGnyAcJml2QtbsGcZJOdySwud/PAW+zk/b3z/sjMfgxoNBqNRqMR5hFwCpytRR84CpB35o09/Cf3yKuxK08p7wB3QzQD5rneb+s0A+Zt5ZpI8hbqwMHa9eGW3AfA57XrsooGVBhxOTdxsGHc2DB2x4tduULE9hF7+DWwaVwkVwhRI6qWovK5hIyYpnnoOA6u64YajuNgmuZ9kd6E/tJEInEvlUp9Xa1Wt0V0osRisV/z+fyx4zg/gmpk1uZN4APwpFKpuNlsdu/1DTAej91er2cAX4DnwG8RvWwTMeBjp9N5WiwWJUtcZDgcUqvVPgHPgJWSogE5xv+hJxvHss2ouP1GAm0kamgjUUMbiRraSNTQRqLGpTGyzxdfud1uUyqVlDQyGAyo1+tl4JuMXvY1PgGcVqvVu+l0WrLERWazGd1u9yfnhxiOqF7GyPV4PP621WqdZDIZCbk/0+mURqPxfrlcvgRsEa3M0nplGMaJZVlMJhMJuT+WZQG8AL4Db5QW30AT9R9Uu04ud3K171qFQoFkMqm6FwAWiwWj0SiU2gANvJPyfD4/sW3bDQvbtt1cLjfh78n8a5VG+oS/L/yiH6TBS7NHrpyR8HaformDPtlvALfke9mLEbD4T3NrNJqo8QcP9nz4ia17tAAAAABJRU5ErkJggg==",
        whiteBishop: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFfklEQVRoge2ZX2hTZxiHn/dEY2Ka2tRuoi2KEaw2a9cm2K0XBf/UrgjDYe+2K72TeSEOxi42FGQwtbirwbyQXQy80VSa4VYUL4azF+La4EZrBdmFIrWriWuTJjpz3l2kp25LkyY91jjWBw75cnLOe36/77zvd873BZZYYon/BbLIsT8A3pn53g+cA3QRr7konAPUMAw1DEPJGvi2zJpKZg+ge/bs0fHxcX348KF2dXVZZt6Z59xXih5Ab9++rRbDw8OWkVOLcUFjMYICCYBYLDa7Y2JiwmpOLdI1F4UWEcls2bLFjEQiGolEdPPmzaaIPAPeLLe4UvlCREyy6aQz7c/LrKkk1gLfABlAN2zYYK5fv94ylAHOAmvKqK8o3jMMIwZoR0eHDgwMzBb79evXdefOnUp2SJ4A3i2z1jkRsmmjNTU1md7eXs3H+fPndfXq1RnABI6WV3YuXwLa1tZmjo2N5TVh8eDBA21tbbXS7ZWpm/2Abt++XZPJZI7ocDis4XA4Z38ikdD29nYle2feL7MH6kQkUVdXlxkfH5+z9xsbG7WpqWnO38bGxnTt2rUZEZkkO0iUja8BvXTpUt40CgQCGggE8v7e19dnPfG/KpeJVSIyvW3bNnMucfX19er3+9XpdKrT6VS/36/19fUaiURyzLS0tJgikgC8CxVj5xVlh6q69+/fnzMVME0Tr9eLz+fD4XDgcDjw+Xx4vV5M08wJdODAAVFVD7Ddhp4FcxzQW7du5U2bYlJLVTUajVrpdWyhYpbZMLIGoLa2tuBBhmEgUnj+tm7dOqv5+kLF2DGSBkin0wUPOnbs2PyBnscoHKwAdozcAYhGo3/v0Rz27ds3b6DBwcF/xHzZ1ANmd3d3wfwvhr1791oPxk3lMALwnYhoX1/fgk1cuHDBKvSL5TIBsMEwjAmn02mePn16zleUfCQSCe3p6dHly5ebhmGMA4VHjZdAk4j8RnbyZPXuvJt1rIjcBd6wK8JOsVvcUtVe4IjX62XXrl0sW1Y47LNnz7h69SqTk5PMnPvrC9Bhm07ADIVCGovFik6tR48eaTAYtIq8o8weQESG3G63eefOnZILfXR0VF0ulykiN+3qsJta1aravHHjRs6ePbugAH6/X4aHh0OAD4jb1LNguimyuIvYuu0IsXtHKgHOnDlDR8fC0vzy5cscPHgQoMKmFluEAA0EAmZvb6+m0+mi6yOVSmk4HNaGhgZr7t5iR8iL+FvhMxH5VFWdlZWV2tXVJc3NzWzdupWqqiq83uxcaWpqing8zsjICNFolP7+fp2amhIReaKqx3lFFiFqgU9EZIjia+Jn4GMg/xtnCZR6R2rJji7VgBNYCawA3IBr5nMLEBKRoKo6Vq5cqQDT09MiIhlVHQRuAqNAiuyrewp4AkwDT4HYzPbAnr3nLAc+BH4SkT8osrd9Pl+ms7NTT548qfF4XGOxmJ44cUJ3796tVVVVmWLjzFzzIvD2fEIL3ZEaEbmiqs0ej0dDoZA0Nzfj8/morq7G5XLhdrtxuVyzbY/HQ0NDA6tWrZoNMjk5CUBlZeXsvsePHzMyMkIymSSVSpFOp0mn07PtWCxGPB5ncHCQgYEBTNO0VlmOAH+WYsQBXAfeOnz4MEePHuX+/fsMDQ2RSqVIJpM8ffo0bw+oKvfu3WNoaIgbN24oQGtrqwSDQerq6gpOfZ1OJx6PB7fbTTAYJJPJcOjQIa5duwbwPdk149wVjDysFpG0w+Ew29vbtaKiYvbvgVI2EZkGfgD6Z9olx6ioqDDb2tqseCmy9ZlDodTaAZwSkU2qOgpcAX4hW4RWkebjCfAQ+P1f+18ju2ixosC51qBRDTQCnSKyWVXvAh8BPxY4d4kllljiP8JfeSue32b2FuYAAAAASUVORK5CYII=",
        whiteKing: "data:image/png;base64,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",
        whiteKnight: "data:image/png;base64,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",
        whitePawn: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADf0lEQVRoge2ZTUhjVxTHf+fyEiUp05oPUmwWVvsBpTsFoSs7tUUqLkPRjS1WEKQLoSAEBTezFl2MCxk3XXY9uhjoopvS0jLUboqhnTdqLK1VRCERTd6ZhfNEp7GTZ26Mi/wg8OC+m/P/c8/9OPdBkyZNmjRp0qRuRICvgO+Ax8Aa8DkQaqCmwLwnIk8BjUQiXkdHRzkcDnuAisivQHuD9VXFK8aYJ47jePPz81ooFFRV9eDgQLPZrIqIisgPgGm00JfxNaALCwtaiampKQUUyDRY50t5FI1GvePj44pGdnZ2fCMPbAe2PcTxRCJBS0tLxcZUKoXjOArELce1buTPra0tjo6OKjZubGxQKpUE+MNyXOt8CejMzEzF1BodHfVT6xPbgW2OyLsiMg2wvr6O53mXGguFArlcDgARuQekLMa2xh0R2QiFQt7i4mLF0VBVLZVK58sw8D23cIO8D+jS0tKVJi6SzWb9FJtusO5LJEWk2NvbW5UJVdWTkxNNp9OeMSYPODZE2JgjA6raOjk5WXWHUCjExMSEeJ7XDnxgQYMVI28DdHd3B+p04f13LGiwYiQOEI8H2+MSicT5owUNVoz8BZDP5wN12t7e9h93LGiwYuRngLW1tUCdVldXL/W/DTjGmH/a29u9w8PDqlatzc1NjUajnog8brT4F/kC0JGRES2Xy/9rolgsal9fnwIecLfBuv+DAX7juZlisVjRxP7+vvb39/ub4UPbAmrldc5q8vdbW1s1Go3ium7FF3O5HMlk0j/Kfwp8A9yxoKFm3jTGPAV0bGxMd3d3q5ojruvq0NCQclbH/0Id6pMgxIwxrjHGW1lZqcrAi8zNzflmfgIqV2N1xnCW47q8vHwtEz4XDpBLjTAyBuj4+HhNJlRVy+WyDgwM+GY+vkkTrxlj/k2n02X/uqdW8vm8RiKRsoj8zg3WKNOAXndeXMXs7Kw/Kp/dhAkRkSepVMo7PT21amRvb0+f30g+uo6woPtIr6p2DA8Pi+NYqYfOicViDA4OiojcBd4I2j+okY8AMpn6XBRmMhlU1QAf1iXABR6Gw+ErbxJrxXVdf57cr6sLEfm7p6enLiZ8EomEB/wYVFuQ1HJUNdnZ2Rk0RiC6urpEROo6R14FpK2tLWiMQMRiMYBYPWO8xVn+3tQv0NkryBp6DHwb5M9r5NZ/DGrSpEkDeAZ9sJUpU8MgQgAAAABJRU5ErkJggg==",
        whiteQueen: "data:image/png;base64,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",
        whiteRook: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAC40lEQVRoge2YsWsTURzHP++ZNto7qBwOYrLUdtNzqZhFCh10cdB/oRQcxK2LIE4i0sH1xKlQMhcdnDq0FJcOWXJ0SpBCE8nUpHAtIcX8HNraJLVN7t5Vg9wHHuTuvu/3ft979+7yfpCQkJCQkJCACql/Brzu6fcTWAC+9dEBCPAO+Nxx7iHwAbjSR3chqUGFxzwG7k9NTTE+Po7v+7RaLYAndBvp0gHs7e1RLpdPrvUaeTA6OorruhfpYsUDpNFoiIhIsVgUju6eAJ86mnTqREQajcaF2mKx2KvzwiQWdka6yGQynYfPOw8cxxHLsn4/WpZl4TiO7O7uql7tH2KFxsiI4zg0m00ODg7OXLNtW6VSp+FTqRS1Wk0FQXBGOzY2RjqdNkkltJFrAOvr61iWZTTweezv73eNdVlscfqcX3bbCpNY2NfvtFJqFbg+NzencrlcyO4Xs7m5ydLSkgANEXkEFGIdoIcJrfWO1rqdz+clLvL5vGit21rrHWAibFJhZ+SE21rrDdu2M9lstj0yMhIxzBGHh4dUKhUdBEG13W7PAN+NAoZkHhDP84xnw/O8k3UxHzUZbWCkZtA39pgmRoaKxMiwkRgZNhIjw0ZiZNj4b4wY7RAB6vU69XrdOIYpJkbuKqVYXl5mZWXFKIkgCFBKISJ3gK9GwUIyopQqp9Np2d7eNv73WygUBBClVBmItCeIMiOjgCcik7lcjlKpRKlUijJ2FzMzM2xsbEwCH4EXQMs4aB9ecvn79YWwSUWZERtgdnbWuBbVS7VaZW1tDeBGrIHP4RUdlcE46ahcvg+b1H/zHRm0+PAGeHr8+yaQOSk6x0lHUbwGVI9PfwHe9us7qJEi4E5PTxMEAZVKBRGJlGzfhJQim81i2zaFQgHAB+7FFb/oum7sa6IfrusKRzexLwO/tXzfZ3FxMfKdiILv+7HHXOXv1Xx72+ogCQ66Rq4CtwbUxs0PoPmPxk5ISBg2fgEmGtoDZBTybwAAAABJRU5ErkJggg=="
    };
    const EMPTY = '.';
    const DIRECTION = {
        UP_LEFT: {rank: 1, file: -1},
        UP_RIGHT: {rank: 1, file: 1},
        DOWN_LEFT: {rank: -1, file: -1},
        DOWN_RIGHT: {rank: -1, file: 1},
        LEFT: {rank: 0, file: -1},
        RIGHT: {rank: 0, file: 1},
        UP: {rank: 1, file: 0},
        DOWN: {rank: -1, file: 0}
    };

    /** ========= Public facing interface for rendering/controlling the game =========**/

    /** Send a new game invite **/
    scope.sendInvite = function(roomhandle, note) {
        let chatroom = megaChat.getChatById(roomhandle);
        if (!chatroom) {
            console.error("Room does not exist", roomhandle);
            return false;
        }

        // Generate a very basic textMessage which gets rendered for clients that don't support the meta data type.
        let text = "Has invited you to play chess";
        if (note) text += ": " + note;
        chatroom.sendMessage(preparemsg({
            textMessage: text,
            boardstate: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            move: null,
            note: note || null,
            previous: null,
        }));
    };

    /** Send a move based on an existing game **/
    scope.sendMove = function(roomhandle, responseto, boardstate, move, note) {
        note = note || null;
        let chatroom = megaChat.getChatById(roomhandle);
        if (!chatroom) {
            console.error("Room does not exist", roomhandle);
            return false;
        }

        // Generate a text description of the move for old clients.
        let text = `Made a chess move: ${move}`;
        if (note) text += ` (${note})`;

        chatroom.sendMessage(preparemsg({
            textMessage: text,
            boardstate: boardstate,
            move: move,
            note: note,
            previous: responseto,
        }));
    }

    /**
     * Render a preview thumbnail for the inchat feed
     * perspective: white is 0, black is 1
     **/
    scope.renderpreview = async function (canvas, ctx, previousstate, currentstate, move, perspective = 0) {
        const renderings = [];

        // Draw the tiles.
        const tileSize = canvas.width / 8;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                ctx.beginPath();
                ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
                let color = (y % 2 === 0) ? (x % 2 === 0 ? 0 : 1) : (x % 2 === 0 ? 1 : 0);
                ctx.fillStyle = color === 0 ? "grey" : "brown";
                ctx.fill();
            }
        }

        // Draw the boarder
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "black";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();

        fenplacementiterator(currentstate, item => {
            // Calculate some render specs.
            let tileColor = (item.rank % 2 === 0) ? (item.file % 2 === 0 ? 0 : 1) : (item.file % 2 === 0 ? 1 : 0);
            let sprite = sprites[(item.white ? 'white' : 'black') + item.type];
            /**
             * In order to correctly render different perspectives, we need to alter the rank/file.
             * If white perspective, then we render lower ranks further away
             * if black perspective, then we render higher ranks further away.
             */
            let render_rank = perspective ? item.rank : 7 - item.rank;
            let render_file = perspective ? 7 - item.file : item.file;
            let pos = {
                y: ((render_rank) * tileSize) + (tileSize / 2),
                x: (render_file * tileSize) + (tileSize / 2),
            };

            if (sprite) {
                renderings.push(drawimg(canvas, ctx, pos, {w: tileSize, h: tileSize}, sprite));
            }
            else {
                ctx.font = "10px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = (item.white ? "white" : "black");
                ctx.fillText(item.fen, pos.x, pos.y);
            }
        });

        // Render the last move.
        // TODO.

        // Wait for all rendering to settle or errors.
        return Promise.all(renderings);
    }

    /** Load a board state into a game instance **/
    scope.load = function(chatmessage) {
        return new MEGAChess(chatmessage);
    }

    /** Open a chess game as the dialog **/
    scope.open = function (chessgame) {
        return new Promise((resolve, reject) => {
            if (!chessgame instanceof MEGAChess) reject(new ChessError("Not a chess game"));


        });
    };

    /** Load a chess game from a chat message **/
    scope.openFromMessage = function(chatmessage) {
        return new Promise((resolve, reject) => {
            let game = scope.load(chatmessage);
            scope.open(game).then(() => {
                logger.info("Game Loaded", game);
                resolve(game);
            }, reject);
        });
    }

    /** ========= Internal chess game functions =========**/

    /** Create the MEGAChess object for storing gamestate. **/
    function MEGAChess(chatmessage) {
        if (!ischessmsg(chatmessage)) return new ChessError("Not a chess message.", chatmessage);
        this.spawnmessage = chatmessage;

        // Load in board state.
        this.board = Array(8 * 8).fill(EMPTY);
        this.fenstate = parseFEN(chatmessage.meta.boardstate);
        fenplacementiterator(this.fenstate.placement, item => {
            this.board[item.rank * 8 + item.file] = item.fen;
        });

        this.enpassant = this.fenstate.enpassant;
        this.castling = this.fenstate.castling;
        this.turn = this.fenstate.turn;
        this.halfmoves = this.fenstate.halfmoves;
        this.fullmoves = this.fenstate.fullmoves;

        logger.info("Loaded Game: ", this);
    }

    /** Alter the gamestate with move. **/
    MEGAChess.prototype.makemove = function (move) {
        if (!this.isValidMove(move)) return new ChessError("Invalid move", move);
        /**
         * 1. Commit the move
         * 2. Send the move to the channel
         * 3. Trigger UI update.
         */
    };

    /** Check if a move is valid **/
    MEGAChess.prototype.isValidMove = function(move, morphscan = true) {
        // Within the bounds of the game.
        if (move.to < 0 || move.to > 63) return false;

        const pos_data = moveposdata(move);

        const piece = FENChar(this.board[move.from]);
        if (!piece) return false;

        if (!this._validMovement(move, piece, pos_data)) return false;
        if (morphscan) {
            const step = calculateDirectionPos(pos_data);
            if (this._morphScan(step, move.from, move.to) !== move.to) return false;
        }
        return true;
    };

    /** Check that the pieces are moving correctly **/
    MEGAChess.prototype._validMovement = function(move, piece, pos_data) {
        const capturing = this.board[move.to] !== EMPTY;
        if (capturing) {
            let other = FENChar(this.board[move.to]);
            if (!other || piece.white === other.white) return false;
        }

        const distance = Object.assign({}, pos_data.distance);
        const modify = function (modifier) {
            distance.rank = modifier(distance.rank);
            distance.file = modifier(distance.file);
        };

        switch (piece.type)
        {
            case PIECES.ROOK:
                modify(Math.abs);
                if (distance.rank > 0 && distance.file === 0) return true;
                if (distance.file > 0 && distance.rank === 0) return true;
                break;

            case PIECES.KNIGHT:
                modify(Math.abs);
                if (distance.rank === 1 && distance.file === 2) return true;
                if (distance.rank === 2 && distance.file === 1) return true;
                break;

            case PIECES.BISHOP:
                modify(Math.abs);
                if (distance.rank === distance.file) return true;
                break;

            case PIECES.QUEEN:
                modify(Math.abs);
                if (distance.rank === distance.file) return true;
                if (distance.rank > 0 && distance.file === 0) return true;
                if (distance.file > 0 && distance.rank === 0) return true;
                break;

            case PIECES.KING:
                modify(Math.abs);
                if (distance.rank < 2 && distance.file < 2) return true;
                if (distance.rank === 0 && distance.file === 2) {
                    // Attempting to castle.
                    if ((piece.white && move.from === 4) || (!piece.white && move.from === 60)) {
                        if (move.to < move.from) {
                            // Moving Queenside.
                            if (piece.white && this.castling.whiteQueen) return true;
                            else if (piece.black && this.castling.blackQueen) return true;
                        }
                        else {
                            // Moving Kingside.
                            if (piece.white && this.castling.whiteKing) return true;
                            else if (piece.black && this.castling.blackKing) return true;
                        }
                    }
                }
                break;

            case PIECES.PAWN:
                /**
                 * Pawns can only move "forward", this would be mean legal moves: {black: -1, white: +1}.
                 * To simply the logic, movement has been converted to the pieces native type,
                 * so +1 means "forward" and -1 means "backwards" in relation to the pawns colour and starting point.
                 *
                 * We also need to know if this is the first move for the pawn,
                 * we can tell this by checking if the from position is on the starting rank.
                 */
                let first = false;
                if (piece.white) first = pos_data.from.rank === 1;
                else {
                    first = pos_data.from.rank === 6;
                    distance.rank = -distance.rank;
                }

                if (distance.file === 0) {
                    if (distance.rank === 1 && !capturing) return true;
                    if (distance.rank === 2 && first && !capturing) return true;
                }

                if (distance.rank === 1 && Math.abs(distance.file) === 1) {
                    if (capturing) return true;
                    if (this.enpassant) {
                        if (move.to === notation2idx(this.enpassant)) return true;
                    }
                }
                break;
        }

        return false;
    };

    /**
     * Scan in a direction until:
     *   - Out of bounds
     *   - Encounter another piece
     *   - Reach dest (if provided)
     *
     *   Returns the position of the first issue discovered. (possibly out of bounds!).
     **/
    MEGAChess.prototype._morphScan = function (step, start, dest = null) {
        let discover = this._morphDiscover(step, start, dest);
        let pos;
        do {
            pos = discover.next();
        } while (!pos.done);
        return pos.value;
    };

    /** Scan in a direction returning all valid moves until an invalid move is encounter **/
    MEGAChess.prototype._morphDiscover = function* (step, start, dest = null) {
        let generator = iterateDirectionStep(step, start, dest);
        let pos;
        do {
            pos = generator.next();
            if (Number.isInteger(pos.value)) {
                if (this.board[pos.value] !== EMPTY) return pos.value;
                if (pos.value === dest) return pos.value;
                yield pos.value;
            }
        } while (!pos.done);
    };

    /** Calculate all the valid moves from a starting position **/
    MEGAChess.prototype.getValidMoves = function (from) {
        console.time('MEGAChess::getValidMoves');
        const currentpos = idx2rankfile(from);
        const piece = FENChar(this.board[from]);
        if (!piece) return false;

        /**
         * Based on the starting piece type, generate a list of all possible destination moves / directions.
         * Check the allowed moves to check if they are valid.
         * Scan the allowed directions to see if they are valid.
         *
         * Here is a grid to assist with movements.
         * +14 +15 +16 +17 +18
         * +06 +07 +08 +09 +10
         * -02 -01 +00 +01 +02
         * -10 -09 -08 -07 -06
         * -18 -17 -16 -15 -14
         */
        let validlocations = [];
        const steps = []; // Scan directions.
        const moves = []; // Static moves.
        switch (piece.type) {
            case PIECES.ROOK:
                steps.push(DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT);
                break;
            case PIECES.KNIGHT:
                moves.push(
                    {rank: 1, file: 2},
                    {rank: -1, file: 2},
                    {rank: -2, file: 1},
                    {rank: -2, file: -1},
                    {rank: -1, file: -2},
                    {rank: 1, file: -2},
                    {rank: 2, file: -1},
                    {rank: 2, file: 1}
                );
                break;
            case PIECES.BISHOP:
                steps.push(DIRECTION.UP_LEFT, DIRECTION.UP_RIGHT, DIRECTION.DOWN_LEFT, DIRECTION.DOWN_RIGHT);
                break;
            case PIECES.QUEEN:
                steps.push(
                    DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT,
                    DIRECTION.UP_LEFT, DIRECTION.UP_RIGHT, DIRECTION.DOWN_LEFT, DIRECTION.DOWN_RIGHT
                );
                break;
            case PIECES.KING:
                moves.push(
                    DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT,
                    DIRECTION.UP_LEFT, DIRECTION.UP_RIGHT, DIRECTION.DOWN_LEFT, DIRECTION.DOWN_RIGHT,
                    {rank: 0, file: 2}, {rank: 0, file: -2}
                );
                break;
            case PIECES.PAWN:
                if (piece.white) moves.push(DIRECTION.UP, DIRECTION.UP_LEFT, DIRECTION.UP_RIGHT, {rank: 2, file: 0});
                else moves.push(DIRECTION.DOWN, DIRECTION.DOWN_LEFT, DIRECTION.DOWN_RIGHT, {rank: -2, file: 0});
                break;
        }


        for (let i = 0; i < moves.length; i++) {
            let newpos = {
                rank: currentpos.rank + moves[i].rank,
                file: currentpos.file + moves[i].file,
            };

            if (newpos.rank < 0 || newpos.rank > 7 || newpos.file < 0 || newpos.file > 7) continue;
            let dest = rankfiletoidx(newpos);
            let morphscan = false;
            if (piece.type === PIECES.PAWN && Math.abs(moves[i].rank) > 1) morphscan = true;
            if (piece.type === PIECES.KING && Math.abs(moves[i].file) > 1) morphscan = true;
            if (this.isValidMove({from: from, to: dest}, morphscan)) validlocations.push(dest);
        }

        for (let i = 0; i < steps.length; i++) {
            const gen = this._morphDiscover(steps[i], from);
            let next;
            do {
                next = gen.next();
                let dest = next.value;
                if (Number.isInteger(dest)) {
                    if (this.board[dest] !== EMPTY) {
                        let other = FENChar(this.board[dest]);
                        if (!other || (other.white === piece.white)) break;
                    }
                    validlocations.push(dest);
                }
            } while (!next.done);
        }

        console.timeEnd('MEGAChess::getValidMoves');
        return validlocations;
    }

    /** Open rendering in new image **/
    MEGAChess.prototype.openImage = function (size, perspective= 0) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas');
            canvas.width = canvas.height = size;
            this.renderToCanvas(canvas, canvas.getContext('2d'), perspective).then(() => {
                canvas.toBlob(blob => {
                    let url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                });
            }, reject);
        });
    };

    /** Render the current board state **/
    MEGAChess.prototype.renderToCanvas = async function (canvas, ctx, perspective= 0) {
        const renderings = [];
        renderBoard(canvas, ctx);
        const tileSize = canvas.width / 8;

        for (let cursor = 0; cursor < this.board.length; cursor++) {
            let piece = FENChar(this.board[cursor]);
            if (!piece) continue;
            let rankfile = idx2rankfile(cursor);

            let sprite = sprites[(piece.white ? 'white' : 'black') + piece.type];
            let render_rank = perspective ? rankfile.rank : 7 - rankfile.rank;
            let render_file = perspective ? 7 - rankfile.file : rankfile.file;
            let pos = {
                y: ((render_rank) * tileSize) + (tileSize / 2),
                x: (render_file * tileSize) + (tileSize / 2),
            };

            if (sprite) {
                renderings.push(drawimg(canvas, ctx, pos, {w: tileSize, h: tileSize}, sprite));
            }
            else {
                ctx.font = "10px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = (piece.white ? "white" : "black");
                ctx.fillText(this.board[cursor], pos.x, pos.y);
            }
        }

        // Render the last move.
        // TODO.

        // Wait for all rendering to settle or errors.
        return Promise.all(renderings);
    };

    /** Export state as FEN string **/
    MEGAChess.prototype.asFEN = function () {
        let FENstr = '';
        for (let i = this.board.length - 8; i >= 0; i-= 8)
        {
            let emptycount = 0;
            for (let j = 0; j < 8; j++) {
                if (this.board[i + j] === EMPTY) emptycount++;
                else {
                    if (emptycount) {
                        FENstr += emptycount;
                        emptycount = 0;
                    }
                    FENstr += this.board[i + j];
                }
            }
            if (emptycount) FENstr += emptycount;
            if (i !== 0) FENstr += '/';
        }

        FENstr += ' ' + this.turn;
        let castling = '';
        if (this.castling.whiteKing) castling += 'K';
        if (this.castling.whiteQueen) castling += 'Q';
        if (this.castling.blackKing) castling += 'k';
        if (this.castling.blackQueen) castling += 'q';
        FENstr += ' ' + (castling || '-');
        FENstr += ' ' + (this.enpassant || '-');
        FENstr += ' ' + this.halfmoves;
        FENstr += ' ' + this.fullmoves;
        return FENstr;
    };

    /** Generate text version of game **/
    MEGAChess.prototype.toString = function() {
        return this.asFEN();
    };

    /** Given a move, calculate the direction of the piece in the lowest step possible **/
    function calculateDirectionPos(pos_data) {
        /**
         * Note, directions in chess are always some multiple of 45,
         * so to make things easier, the direction is always assumed to be step = 1
         */

        return {
            rank: Math.sign(pos_data.distance.rank),
            file: Math.sign(pos_data.distance.file),
        };
    }

    /** Simplify things by having a single "pos" object for moves **/
    function moveposdata(move) {
        const pos_from = idx2rankfile(move.from);
        const pos_to = idx2rankfile(move.to);
        return {
            from: pos_from,
            to: pos_to,
            distance: calculateDistancePos(pos_from, pos_to)
        };
    }

    /** Convert algebraic notation into rank file combo **/
    function notation2rankfile(str) {
        if (str.length !== 2) return false;
        str = str.toLowerCase();

        let chr = str.charCodeAt(0);
        let num = str.charCodeAt(1);

        if (chr < 97 || chr > 104) return false;
        if (num < 49 || num > 56) return false;

        return {
            rank: chr - 97,
            file: num - 49
        };
    }

    /** Convert algebraic notation into board index value **/
    function notation2idx(str) {
        let pos = notation2rankfile(str);
        if (!pos) return pos;
        return pos.rank * 8 + pos.file;
    }

    /** Calculate distance between two points in terms of rank and file **/
    function calculateDistancePos(pos_from, pos_to) {
        return {
            rank: pos_to.rank - pos_from.rank,
            file: pos_to.file - pos_from.file,
        };
    }

    /** Convert board index value into a rank/file combo **/
    function idx2rankfile(idx) {
        const rank = Math.floor(idx / 8);
        return {
            rank: rank,
            file: idx - (rank * 8)
        };
    }

    /** Convert rank/file combo into board index value **/
    function rankfiletoidx(rank, file) {
        if (typeof rank === "object") return rank.rank * 8 + rank.file;
        return rank * 8 + file;
    }

    /** Parse FEN state into object **/
    function parseFEN(fen) {
        const parts = fen.split(' ');
        if (parts.length < 5) return null;
        return {
            placement: parts[0],
            turn: parts[1],
            castling: {
                whiteQueen: parts[2].indexOf('Q') >= 0,
                whiteKing: parts[2].indexOf('K') >= 0,
                blackQueen: parts[2].indexOf('q') >= 0,
                blackKing: parts[2].indexOf('k') >= 0,
            },
            enpassant: parts[3],
            halfmoves: parseInt(parts[4]),
            fullmoves: parseInt(parts[5]),
            fen: fen
        };
    }

    /** Get info about a single FEN character **/
    function FENChar(fenchar) {
        if (typeof fenchar !== "string") return false;
        if (fenchar.length !== 1) return false;
        const type = FENNotation[fenchar.toLowerCase()] || null;
        if (!type) return false;

        const ascii = fenchar.charCodeAt(0);
        const white = ascii >= 65 && ascii <= 90;

        return {
            type: type,
            white: white,
        };
    }

    /** Iterate each position in a fen message, executing the callback with each valid non-empty position **/
    function fenplacementiterator(fen, callback) {
        let lines = fen.split(' ')[0].split('/');
        let rank = 7;
        for (let line = 0; line < lines.length; line++, rank--) {
            let file = 0;
            for (let i = 0; i < lines[line].length; i++) {
                let ascii = lines[line].charCodeAt(i);
                if (ascii >= 48 && ascii <= 57) file += parseInt(lines[line][i]);
                else {
                    let type = FENNotation[lines[line][i].toLowerCase()] || null;
                    let white = ascii >= 65 && ascii <= 90;
                    if (type) {
                        callback(Object.freeze({
                            type: type,
                            rank: rank,
                            file: file,
                            white: white,
                            fen: lines[line][i]
                        }));
                    }
                    file++;
                }
            }
        }
    }

    /** Check if a chatmessage is a valid MEGAChess message type. **/
    function ischessmsg(chatmessage) {
        return chatmessage && chatmessage.metaType && chatmessage.metaType === Message.MESSAGE_META_TYPE.CHESS;
    }

    /** Prepare a megachess message for chat **/
    function preparemsg(meta) {
        return (
            Message.MANAGEMENT_MESSAGE_TYPES.MANAGEMENT +
            Message.MANAGEMENT_MESSAGE_TYPES.CONTAINS_META +
            Message.MESSAGE_META_TYPE.CHESS +
            JSON.stringify(meta)
        );
    }

    /** Cache a renderable as an image **/
    function spritecache(renderable) {
        if (!spritecache.cache) spritecache.cache = {};

        // Attempt to load the image and render it, else resolve with null value.
        return new Promise((resolve) => {
            if (!spritecache.cache[renderable]) {
                let img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = renderable;
                spritecache.cache[renderable] = img;
            }
            else resolve(spritecache.cache[renderable] || null);
        });
    }

    /** Render an image to the canvas **/
    function drawimg(canvas, ctx, pos, size, renderable) {
        return new Promise((resolve, reject) => {
            spritecache(renderable).then(img => {
                if (img) ctx.drawImage(img, pos.x - size.w / 2, pos.y - size.h / 2, size.w, size.h);
                resolve();
            }).catch(reject);
        });
    }

    /** Render the board to canvas **/
    function renderBoard(canvas, ctx) {
        const tileSize = canvas.width / 8;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                ctx.beginPath();
                ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
                let color = (y % 2 === 0) ? (x % 2 === 0 ? 0 : 1) : (x % 2 === 0 ? 1 : 0);
                ctx.fillStyle = color === 0 ? "grey" : "brown";
                ctx.fill();
            }
        }

        // Draw the boarder
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "black";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
    }

    /** Yields each position in direction until edge of board **/
    function *iterateDirectionStep(step, cursor, dest = null) {
        let current = idx2rankfile(cursor);
        do {
            current.rank += step.rank;
            current.file += step.file;
            if (current.rank < 0 || current.rank > 7 || current.file < 0 || current.file > 7) return null;
            cursor += step.rank * 8 + step.file;
            if (cursor === dest) return cursor;
            yield cursor;
        } while (cursor >= 0 && cursor <= 63);
        return null;
    }

    /** ChessError type returned when an error occurs. **/
    class ChessError extends Error {
        constructor(msg, ...params) {
            super(msg);
            if (Error.captureStackTrace) Error.captureStackTrace(this, ChessError);
            this.name = 'ChessError';
            this.extra = params;
        }
    }

    // Export some stuff for debugging.
    if (localStorage.d) {
        scope.idxtorankfile = idx2rankfile;
    }
})(mega.chess = {});

